"""AI analysis and summarization service with dynamic model discovery and multi-strategy execution."""

import json
import logging
import re
import time
from typing import Optional, List, Dict, Any
import httpx

# Primary modern SDK
try:
    from google import genai
    from google.genai import types as genai_types
    HAS_GOOGLE_GENAI = True
except ImportError:
    HAS_GOOGLE_GENAI = False

# Legacy fallback SDK
try:
    import google.generativeai as legacy_genai
    HAS_LEGACY_GENAI = True
except ImportError:
    HAS_LEGACY_GENAI = False

from ..config import settings
from ..models.schemas import (
    SummaryLength,
    MainIdea,
    ImprovementSuggestion,
    DocumentAnalysisResponse,
    DocumentMetadata,
)
from .chunking_service import chunking_service

logger = logging.getLogger(__name__)

# Default priority fallback models (High-quota models first)
DEFAULT_CANDIDATE_MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-1.0-pro",
    "gemini-pro",
]


class AIService:
    """Service to handle LLM interactions, prompts, structured output extraction, and map-reduce."""

    def is_configured(self, api_key: Optional[str] = None) -> bool:
        """Check if a valid Gemini API key is available."""
        key = api_key or settings.GEMINI_API_KEY
        return bool(key and key.strip() and key != "your_gemini_api_key_here")

    def _get_active_key(self, api_key: Optional[str] = None) -> str:
        """Retrieve active API key or raise error if none."""
        key = api_key or settings.GEMINI_API_KEY
        if not self.is_configured(key):
            raise RuntimeError(
                "Gemini API key is not configured. Please enter your Gemini API key in the settings modal "
                "or configure GEMINI_API_KEY in the backend .env file."
            )
        return key.strip()

    def get_available_models_for_key(self, api_key: str) -> List[str]:
        """Query Google API to discover exact supported models for the given API key."""
        discovered = []
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
            with httpx.Client(timeout=8.0) as client:
                res = client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    for m in data.get("models", []):
                        methods = m.get("supportedGenerationMethods", [])
                        if "generateContent" in methods:
                            name = m.get("name", "").replace("models/", "")
                            if name:
                                discovered.append(name)
                    logger.info(f"Discovered {len(discovered)} available Gemini models for API key: {discovered}")
                elif res.status_code in [400, 401, 403]:
                    err_json = res.json().get("error", {})
                    msg = err_json.get("message", "API key invalid or unauthorized.")
                    raise RuntimeError(f"Google Gemini Authentication Error: {msg}")
        except httpx.RequestError as req_err:
            logger.warning(f"Could not query model list (network error): {req_err}")
        except RuntimeError:
            raise
        except Exception as e:
            logger.warning(f"Error querying model list: {e}")

        # Order by preference
        sorted_models = []
        if settings.GEMINI_MODEL and settings.GEMINI_MODEL in discovered:
            sorted_models.append(settings.GEMINI_MODEL)

        for pref in DEFAULT_CANDIDATE_MODELS:
            if pref in discovered and pref not in sorted_models:
                sorted_models.append(pref)

        for m in discovered:
            if m not in sorted_models:
                sorted_models.append(m)

        if not sorted_models:
            sorted_models = [settings.GEMINI_MODEL or "gemini-2.0-flash"] + [
                m for m in DEFAULT_CANDIDATE_MODELS if m != settings.GEMINI_MODEL
            ]

        return sorted_models

    def analyze_document(
        self,
        text: str,
        summary_length: SummaryLength = SummaryLength.MEDIUM,
        metadata: Optional[DocumentMetadata] = None,
        api_key: Optional[str] = None,
    ) -> DocumentAnalysisResponse:
        """Analyze extracted document text and return structured summary, key points, main ideas, and suggestions."""
        if not text or not text.strip():
            raise ValueError("Document text is empty or could not be extracted.")

        key = self._get_active_key(api_key)

        is_large = chunking_service.is_large_document(text)
        try:
            if is_large:
                logger.info("Document exceeds single-pass limit. Using hierarchical Map-Reduce summarization.")
                result_data = self._map_reduce_analysis(text, summary_length, key)
                is_hierarchical = True
            else:
                result_data = self._single_pass_analysis(text, summary_length, key)
                is_hierarchical = False
        except RuntimeError as re_err:
            err_str = str(re_err).lower()
            if "quota" in err_str or "rate limit" in err_str or "429" in err_str or "resource_exhausted" in err_str:
                logger.warning(f"Gemini API quota exceeded/rate-limited. Activating Intelligent Hybrid NLP Extractive Fallback: {re_err}")
                result_data = self._generate_extractive_fallback(text, summary_length)
                is_hierarchical = False
            else:
                raise

        # Fallback metadata if none provided
        if not metadata:
            words = len(text.split())
            metadata = DocumentMetadata(
                filename="document.txt",
                file_type="text",
                file_size_bytes=len(text.encode("utf-8")),
                page_count=1,
                character_count=len(text),
                word_count=words,
                is_scanned=False,
                extraction_method="direct_text",
            )

        # Parse output into Pydantic models
        main_ideas = [
            MainIdea(title=item.get("title", "Topic"), summary=item.get("summary", ""))
            for item in result_data.get("main_ideas", [])
        ]

        improvement_suggestions = [
            ImprovementSuggestion(
                category=item.get("category", "General"),
                suggestion=item.get("suggestion", ""),
                severity=item.get("severity", "medium"),
            )
            for item in result_data.get("improvement_suggestions", [])
        ]

        key_points = result_data.get("key_points", [])
        summary = result_data.get("summary", "")

        return DocumentAnalysisResponse(
            metadata=metadata,
            summary=summary,
            summary_length=summary_length,
            key_points=key_points,
            main_ideas=main_ideas,
            improvement_suggestions=improvement_suggestions,
            extracted_text=text,
            is_hierarchical=is_hierarchical,
        )

    def _get_length_instructions(self, summary_length: SummaryLength) -> str:
        """Return length-specific prompt instructions."""
        if summary_length == SummaryLength.SHORT:
            return (
                "Provide a SHORT summary of exactly 3 to 5 sentences. "
                "Focus exclusively on the most critical high-level takeaways and conclusions. Keep it tight and punchy."
            )
        elif summary_length == SummaryLength.LONG:
            return (
                "Provide a LONG, comprehensive, and detailed executive summary (3 to 5 detailed paragraphs or structured sections). "
                "Cover background context, core methodologies or arguments, key metrics/findings, nuanced analysis, and final implications in depth."
            )
        else:  # MEDIUM
            return (
                "Provide a MEDIUM-length summary consisting of 1 to 3 well-developed paragraphs. "
                "Include core context, central arguments/data, and primary conclusions with good narrative flow."
            )

    def _build_prompt(self, text: str, summary_length: SummaryLength) -> str:
        """Build the analysis prompt ensuring strict JSON response format."""
        length_guide = self._get_length_instructions(summary_length)

        prompt = f"""You are a world-class Document Analyst and Executive Editor.
Analyze the following extracted document text thoroughly and provide a structured analysis.

CRITICAL REQUIREMENTS:
1. SUMMARY:
   {length_guide}
   Do NOT use generic filler. Base all facts strictly on the document text.

2. KEY POINTS:
   Extract 5 to 10 concise, distinct, and meaningful bullet points.
   Each point must be directly supported by the text and easy to scan.

3. MAIN IDEAS / IMPORTANT SECTIONS:
   Identify the primary topics or sections discussed.
   Adapt the headings dynamically based on the actual document content (e.g. "Executive Overview", "Market Analysis", "Methodology", "Financial Results", "Key Recommendations", etc.).
   For each section, provide a concise 1-2 sentence summary of what was discussed.

4. IMPROVEMENT SUGGESTIONS:
   Critically evaluate the document for actionable improvements such as:
   - Clarity or poorly explained points
   - Missing context, evidence, or supporting data
   - Readability and structural flow
   - Repetitive content or missing conclusions
   *Note: If the document is already clear, well-written, and complete, explicitly include a praise suggestion stating the document is clear.*

OUTPUT FORMAT:
You MUST respond ONLY with a valid, parseable JSON object matching this schema:
{{
  "summary": "The generated summary text...",
  "key_points": [
    "Key point 1...",
    "Key point 2...",
    "Key point 3..."
  ],
  "main_ideas": [
    {{
      "title": "Section / Topic Title",
      "summary": "Brief explanation of this section..."
    }}
  ],
  "improvement_suggestions": [
    {{
      "category": "Clarity / Structure / Evidence / Readability / Context",
      "suggestion": "Specific actionable suggestion...",
      "severity": "low / medium / high"
    }}
  ]
}}

DOCUMENT TEXT TO ANALYZE:
---
{text}
---
"""
        return prompt

    def _generate_with_rest(self, model_name: str, prompt: str, api_key: str, json_mode: bool = True) -> Optional[str]:
        """Execute direct REST request to Google Generative Language API."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        
        payload: Dict[str, Any] = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ]
        }
        
        if json_mode:
            payload["generationConfig"] = {"responseMimeType": "application/json"}

        with httpx.Client(timeout=60.0) as client:
            res = client.post(url, json=payload)
            
            if res.status_code == 200:
                data = res.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"]
            
            # If JSON mode failed (some older models don't support responseMimeType), retry without it
            if json_mode and res.status_code in [400, 404]:
                logger.info(f"Retrying REST call for {model_name} without responseMimeType...")
                payload.pop("generationConfig", None)
                res_retry = client.post(url, json=payload)
                if res_retry.status_code == 200:
                    data = res_retry.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            return parts[0]["text"]

            if res.status_code in [401, 403]:
                err_msg = res.json().get("error", {}).get("message", "Authentication failed.")
                raise RuntimeError(f"Google Gemini Authentication Error: {err_msg}")
            elif res.status_code == 429:
                logger.warning(f"REST call to model '{model_name}' hit rate limit (429). Will try fallback candidate models...")
                time.sleep(1.0)
                return None
            else:
                logger.warning(f"REST call to {model_name} returned status {res.status_code}: {res.text[:200]}")
                return None

    def _generate_with_fallback(self, prompt: str, api_key: str, json_mode: bool = True) -> str:
        """Attempt generation cascading through dynamically discovered models and multiple client strategies."""
        models_to_try = self.get_available_models_for_key(api_key)
        logger.info(f"Models candidate sequence for generation: {models_to_try}")

        last_error = None

        # Two passes: first try all models, if all rate-limited, wait 2.5s and try once more
        for attempt in range(2):
            # Strategy 1: Direct High-Performance REST API (bypasses SDK routing issues)
            for model_name in models_to_try:
                try:
                    logger.info(f"Executing REST generateContent with model '{model_name}' (attempt {attempt + 1})...")
                    result_text = self._generate_with_rest(model_name, prompt, api_key, json_mode=json_mode)
                    if result_text:
                        logger.info(f"REST request succeeded with model '{model_name}'")
                        return result_text
                except Exception as rest_err:
                    err_str = str(rest_err)
                    if "Authentication Error" in err_str:
                        raise
                    logger.warning(f"REST request with model '{model_name}' failed: {rest_err}")
                    last_error = rest_err

            # Strategy 2: Modern google.genai SDK
            if HAS_GOOGLE_GENAI:
                try:
                    client = genai.Client(api_key=api_key)
                    for model_name in models_to_try:
                        try:
                            logger.info(f"Attempting google-genai SDK with model '{model_name}'...")
                            config = genai_types.GenerateContentConfig(
                                response_mime_type="application/json" if json_mode else None
                            )
                            response = client.models.generate_content(
                                model=model_name,
                                contents=prompt,
                                config=config,
                            )
                            if response and response.text:
                                return response.text
                        except Exception as genai_err:
                            logger.warning(f"google-genai SDK failed with model '{model_name}': {genai_err}")
                            last_error = genai_err
                except Exception as e:
                    logger.warning(f"google-genai client error: {e}")
                    last_error = e

            # Strategy 3: Legacy google.generativeai SDK
            if HAS_LEGACY_GENAI:
                try:
                    legacy_genai.configure(api_key=api_key)
                    for model_name in models_to_try:
                        try:
                            logger.info(f"Attempting legacy SDK with model '{model_name}'...")
                            gen_config = {"response_mime_type": "application/json"} if json_mode else {}
                            model = legacy_genai.GenerativeModel(
                                model_name=model_name,
                                generation_config=gen_config,
                            )
                            response = model.generate_content(prompt)
                            if response and response.text:
                                return response.text
                        except Exception as leg_err:
                            logger.warning(f"Legacy SDK failed with model '{model_name}': {leg_err}")
                            last_error = leg_err
                except Exception as e:
                    logger.warning(f"Legacy SDK error: {e}")
                    last_error = e

            if attempt == 0:
                logger.info("First pass failed across models, waiting 2s before retry pass...")
                time.sleep(2.0)

        raise RuntimeError(
            f"AI Analysis could not complete across available Gemini models ({', '.join(models_to_try[:4])}). "
            f"Details: {str(last_error)}. "
            f"If you are using a free-tier Gemini API key, please wait 30 seconds for quota to reset, or provide a new key at https://aistudio.google.com/app/apikey"
        )

    def extract_text_from_image(self, image: Any, api_key: Optional[str] = None) -> str:
        """Extract text from a PIL Image using Google Gemini Vision multimodal API with cascading fallback."""
        key = self._get_active_key(api_key)
        models_to_try = self.get_available_models_for_key(key)

        import io
        import base64
        from PIL import Image

        # Convert image to PNG bytes and base64
        if isinstance(image, Image.Image):
            img_to_process = image.convert("RGB") if image.mode in ("RGBA", "P", "LA") else image
            buf = io.BytesIO()
            img_to_process.save(buf, format="PNG")
            img_bytes = buf.getvalue()
        elif isinstance(image, bytes):
            img_bytes = image
            img_to_process = Image.open(io.BytesIO(image))
        else:
            raise ValueError(f"Unsupported image type for vision OCR: {type(image)}")

        img_b64 = base64.b64encode(img_bytes).decode("utf-8")
        prompt = (
            "Extract ALL readable text from this document or image accurately, completely, and verbatim. "
            "Preserve headers, paragraphs, section titles, problem descriptions, formulas, numbers, and bullet points. "
            "Return ONLY the plain extracted text without any conversational preamble or markdown code fences."
        )

        last_error = None

        # Strategy 1: Direct High-Performance REST API with inlineData
        for model_name in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
                payload = {
                    "contents": [
                        {
                            "parts": [
                                {"text": prompt},
                                {
                                    "inlineData": {
                                        "mimeType": "image/png",
                                        "data": img_b64,
                                    }
                                },
                            ]
                        }
                    ]
                }
                with httpx.Client(timeout=60.0) as client:
                    res = client.post(url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts and "text" in parts[0]:
                                extracted = parts[0]["text"].strip()
                                if extracted:
                                    logger.info(f"REST Gemini Vision succeeded with model '{model_name}' ({len(extracted)} chars)")
                                    return extracted
                    elif res.status_code in [401, 403]:
                        err_msg = res.json().get("error", {}).get("message", "API key invalid or unauthorized.")
                        raise RuntimeError(f"Google Gemini Authentication Error: {err_msg}")
                    elif res.status_code == 429:
                        logger.warning(f"REST Vision on {model_name} rate-limited (429). Trying next vision model...")
                        time.sleep(1.0)
                        continue
                    else:
                        logger.warning(f"REST Vision on {model_name} returned status {res.status_code}: {res.text[:150]}")
            except (RuntimeError, ValueError):
                raise
            except Exception as e:
                logger.warning(f"REST Vision error with model '{model_name}': {e}")
                last_error = e

        # Strategy 2: Modern google.genai SDK
        if HAS_GOOGLE_GENAI:
            try:
                client = genai.Client(api_key=key)
                for model_name in models_to_try:
                    try:
                        logger.info(f"Attempting google-genai vision SDK with model '{model_name}'...")
                        response = client.models.generate_content(
                            model=model_name,
                            contents=[img_to_process, prompt],
                        )
                        if response and response.text and response.text.strip():
                            logger.info(f"google-genai vision SDK succeeded with model '{model_name}'")
                            return response.text.strip()
                    except Exception as genai_err:
                        logger.warning(f"google-genai vision error with model '{model_name}': {genai_err}")
                        last_error = genai_err
            except Exception as e:
                logger.warning(f"google-genai client initialization error: {e}")
                last_error = e

        # Strategy 3: Legacy google.generativeai SDK
        if HAS_LEGACY_GENAI:
            try:
                legacy_genai.configure(api_key=key)
                for model_name in models_to_try:
                    try:
                        logger.info(f"Attempting legacy generativeai vision with model '{model_name}'...")
                        model = legacy_genai.GenerativeModel(model_name=model_name)
                        response = model.generate_content([img_to_process, prompt])
                        if response and response.text and response.text.strip():
                            logger.info(f"Legacy generativeai vision succeeded with model '{model_name}'")
                            return response.text.strip()
                    except Exception as leg_err:
                        logger.warning(f"Legacy generativeai vision error with model '{model_name}': {leg_err}")
                        last_error = leg_err
            except Exception as e:
                logger.warning(f"Legacy SDK vision error: {e}")
                last_error = e

        if last_error:
            raise RuntimeError(
                f"Gemini Vision OCR extraction failed across models ({', '.join(models_to_try[:3])}): {str(last_error)}"
            )
        return ""

    def _single_pass_analysis(self, text: str, summary_length: SummaryLength, api_key: str) -> Dict[str, Any]:
        """Run single-pass analysis with automatic model fallback."""
        prompt = self._build_prompt(text, summary_length)
        raw_text = self._generate_with_fallback(prompt, api_key, json_mode=True)
        return self._clean_and_parse_json(raw_text)

    def _map_reduce_analysis(self, text: str, summary_length: SummaryLength, api_key: str) -> Dict[str, Any]:
        """Hierarchical Map-Reduce summarization for large multi-page documents."""
        chunks = chunking_service.split_text_into_chunks(text)
        logger.info(f"Split document into {len(chunks)} chunks for Map-Reduce processing.")

        # Map phase: summarize each chunk
        chunk_summaries = []
        for idx, chunk in enumerate(chunks):
            map_prompt = f"""Summarize section {idx + 1} of {len(chunks)} of a large document.
Capture all essential facts, data points, key arguments, and topics discussed in this section concisely.

SECTION CONTENT:
{chunk}
"""
            try:
                chunk_res = self._generate_with_fallback(map_prompt, api_key, json_mode=False)
                chunk_summaries.append(f"### Section {idx + 1} Findings:\n{chunk_res.strip()}")
            except Exception as e:
                logger.warning(f"Error summarizing chunk {idx + 1}: {e}")
                chunk_summaries.append(f"### Section {idx + 1} Raw Extract:\n{chunk[:1500]}")
            
            # Pacing delay between chunk calls for free-tier rate limits
            if idx < len(chunks) - 1:
                time.sleep(0.5)

        combined_intermediate = "\n\n".join(chunk_summaries)

        # Reduce phase: synthesize full structured response
        reduce_prompt = f"""You are synthesizing the analysis of an entire large document from individual section summaries.

{self._get_length_instructions(summary_length)}

Extract:
1. Cohesive overall summary spanning all sections.
2. 5 to 10 top key points from across the entire document.
3. Major overarching topics/sections.
4. Comprehensive improvement suggestions for the complete document.

Respond in strict JSON schema:
{{
  "summary": "...",
  "key_points": ["..."],
  "main_ideas": [{{"title": "...", "summary": "..."}}],
  "improvement_suggestions": [{{"category": "...", "suggestion": "...", "severity": "..."}}]
}}

COMBINED SECTION SUMMARIES:
{combined_intermediate}
"""
        raw_text = self._generate_with_fallback(reduce_prompt, api_key, json_mode=True)
        return self._clean_and_parse_json(raw_text)

    def _clean_and_parse_json(self, raw_text: str) -> Dict[str, Any]:
        """Safely parse JSON response from LLM, stripping backticks and markdown wrapping if present."""
        text = raw_text.strip()

        # Remove ```json ... ``` wrappers if model included them despite json mode
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Regex search for outermost JSON object
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    pass

            logger.error(f"Failed to parse JSON from AI output. Raw text was:\n{raw_text}")
            # Fallback structure with raw text
            return {
                "summary": raw_text,
                "key_points": ["Direct summary generated from document content."],
                "main_ideas": [{"title": "General Content", "summary": "Extracted document overview."}],
                "improvement_suggestions": [
                    {
                        "category": "Structure",
                        "suggestion": "Consider formatting the document with explicit headings for clearer AI parsing.",
                        "severity": "low",
                    }
                ],
            }

    def _generate_extractive_fallback(self, text: str, summary_length: SummaryLength) -> Dict[str, Any]:
        """High-fidelity NLP extractive summarizer used as a fail-safe fallback when Gemini API quotas are exhausted."""
        import re
        from collections import Counter

        # Clean text and extract sentences
        cleaned = text.replace("\r", " ").strip()
        paragraphs = [p.strip() for p in cleaned.split("\n\n") if p.strip()]
        raw_sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", cleaned) if len(s.strip()) > 15]

        if not raw_sentences:
            raw_sentences = [p for p in paragraphs if p]

        # Stopwords for scoring
        stopwords = {
            "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "in", "on", "at", "to",
            "for", "of", "with", "by", "from", "up", "about", "into", "over", "after", "it", "this",
            "that", "these", "those", "they", "them", "their", "we", "us", "our", "you", "your", "he",
            "him", "his", "she", "her", "which", "what", "who", "when", "where", "why", "how", "all",
            "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not",
            "only", "own", "same", "so", "than", "too", "very", "can", "will", "just", "should", "now"
        }

        # Calculate word frequencies
        words = re.findall(r"\b[a-zA-Z]{3,}\b", cleaned.lower())
        meaningful_words = [w for w in words if w not in stopwords]
        word_counts = Counter(meaningful_words)
        max_freq = max(word_counts.values()) if word_counts else 1

        # Score sentences based on term frequency and position
        scored_sentences = []
        for idx, sentence in enumerate(raw_sentences):
            sentence_words = re.findall(r"\b[a-zA-Z]{3,}\b", sentence.lower())
            if not sentence_words:
                continue
            # TF score
            tf_score = sum(word_counts.get(w, 0) / max_freq for w in sentence_words) / len(sentence_words)
            # Position bias: introductory and concluding sentences carry higher weight
            pos_bonus = 1.3 if idx == 0 else (1.15 if idx < 3 else (1.1 if idx == len(raw_sentences) - 1 else 1.0))
            final_score = tf_score * pos_bonus
            scored_sentences.append((idx, sentence, final_score))

        # Sort by score
        by_score = sorted(scored_sentences, key=lambda x: x[2], reverse=True)

        # Select sentence counts based on requested length
        if summary_length == SummaryLength.SHORT:
            target_count = min(3, len(by_score))
        elif summary_length == SummaryLength.LONG:
            target_count = min(8, len(by_score))
        else:  # MEDIUM
            target_count = min(5, len(by_score))

        top_sentences = by_score[:target_count]
        # Sort top sentences back into original document chronological order
        chronological_summary_sentences = [s[1] for s in sorted(top_sentences, key=lambda x: x[0])]
        summary_text = " ".join(chronological_summary_sentences)

        # Generate Key Points (top 5-8 distinct informative sentences formatted as bullets)
        key_point_candidates = [s[1] for s in by_score[:min(7, len(by_score))]]
        key_points = []
        for s in key_point_candidates:
            cleaned_kp = s.rstrip(".")
            if len(cleaned_kp) > 20 and cleaned_kp not in key_points:
                key_points.append(cleaned_kp)

        if not key_points and raw_sentences:
            key_points = [raw_sentences[0]]

        # Generate Main Ideas based on paragraph clusters
        main_ideas = []
        for i, p in enumerate(paragraphs[:4]):
            p_sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", p) if len(s.strip()) > 10]
            if p_sentences:
                title = f"Topic Section {i + 1}"
                if len(p_sentences[0]) < 60:
                    title = p_sentences[0].rstrip(".")
                main_ideas.append({
                    "title": title,
                    "summary": p_sentences[0] if len(p_sentences) == 1 else " ".join(p_sentences[:2])
                })

        if not main_ideas:
            main_ideas = [
                {"title": "Core Subject", "summary": summary_text[:200] + "..." if len(summary_text) > 200 else summary_text}
            ]

        # Improvement Suggestions
        suggestions = [
            {
                "category": "Clarity & Readability",
                "suggestion": "Include explicit section subheadings and bulleted executive summaries to enhance skimmability.",
                "severity": "low",
            },
            {
                "category": "Evidence & Data",
                "suggestion": "Bolster high-level assertions with specific numerical metrics, comparative benchmarks, or primary citations.",
                "severity": "medium",
            },
            {
                "category": "Actionability",
                "suggestion": "Conclude key sections with direct, actionable next steps or clear practical takeaways for readers.",
                "severity": "low",
            },
        ]

        return {
            "summary": summary_text or text[:500],
            "key_points": key_points,
            "main_ideas": main_ideas,
            "improvement_suggestions": suggestions,
        }


# Singleton instance
ai_service = AIService()
