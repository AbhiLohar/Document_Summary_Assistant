import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ProcessingProgress from './components/ProcessingProgress';
import DocumentMeta from './components/DocumentMeta';
import SummaryLengthSelector from './components/SummaryLengthSelector';
import SummaryCard from './components/SummaryCard';
import KeyPointsCard from './components/KeyPointsCard';
import MainIdeasCard from './components/MainIdeasCard';
import ImprovementSuggestionsCard from './components/ImprovementSuggestionsCard';
import ExtractedTextViewer from './components/ExtractedTextViewer';
import ExportModal from './components/ExportModal';
import ApiKeyModal from './components/ApiKeyModal';
import ErrorAlert from './components/ErrorAlert';
import {
  checkHealth,
  uploadAndExtract,
  summarizeDocument,
  getStoredApiKey,
} from './services/api';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Backend readiness & API key state
  const [backendHealth, setBackendHealth] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Workflow state
  const [currentStage, setCurrentStage] = useState('idle'); // idle | upload | extract | ocr | analyze | summarize | complete | error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentFile, setCurrentFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedLength, setSelectedLength] = useState('medium');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Health check on mount
  const refreshHealth = useCallback(async () => {
    try {
      const data = await checkHealth();
      setBackendHealth(data);
      const userKey = getStoredApiKey();
      setHasApiKey(Boolean(userKey || data.gemini_configured));
    } catch (err) {
      console.warn('Backend health check error:', err);
      setBackendHealth({ status: 'unreachable', gemini_configured: false, tesseract_available: false });
    }
  }, []);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  // Process Document File
  const handleProcessFile = async (file) => {
    setErrorMessage('');
    setCurrentFile(file);
    setCurrentStage('upload');
    setUploadProgress(0);

    try {
      // Step 1: Upload & Extract Text
      const extractRes = await uploadAndExtract(file, (progress) => {
        setUploadProgress(progress);
        if (progress >= 100) {
          setCurrentStage('extract');
        }
      });

      if (!extractRes.success || !extractRes.extracted_text) {
        throw new Error(extractRes.message || 'No extractable text found in document.');
      }

      setExtractedData(extractRes);

      if (extractRes.metadata?.is_scanned) {
        setCurrentStage('ocr');
        await new Promise((r) => setTimeout(r, 400));
      }

      // Step 2: AI Document Analysis
      setCurrentStage('analyze');
      await new Promise((r) => setTimeout(r, 400));
      setCurrentStage('summarize');

      const analysis = await summarizeDocument({
        text: extractRes.extracted_text,
        summaryLength: selectedLength,
        metadata: extractRes.metadata,
      });

      setAnalysisResult(analysis);
      setCurrentStage('complete');

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Processing error:', err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'An error occurred while processing the document. Please try again.';
      setErrorMessage(msg);
      setCurrentStage('error');
    }
  };

  // Switch Summary Length dynamically
  const handleLengthChange = async (newLength) => {
    if (newLength === selectedLength || !extractedData?.extracted_text || isRegenerating) return;

    setSelectedLength(newLength);
    setIsRegenerating(true);
    setErrorMessage('');

    try {
      const updatedAnalysis = await summarizeDocument({
        text: extractedData.extracted_text,
        summaryLength: newLength,
        metadata: analysisResult?.metadata || extractedData.metadata,
      });

      setAnalysisResult(updatedAnalysis);
    } catch (err) {
      console.error('Re-summarization error:', err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Failed to re-summarize at chosen length.';
      setErrorMessage(msg);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Sample Documents Handler — sends text directly to summarize (no file upload needed)
  const handleSelectSample = async (sampleType) => {
    const samples = {
      ai_research: {
        text: `Advancements in Edge Computing and Autonomous Systems
Author: Dr. Elena Rostova | Published: August 2026

1. Executive Abstract
This paper investigates the convergence of distributed edge intelligence and modern autonomous control architectures. Recent advancements in low-power neural processing units (NPUs) enable real-time inference at sub-millisecond latencies, drastically reducing reliance on centralized cloud backbones. We demonstrate an end-to-end framework achieving a 42% decrease in latency and a 35% reduction in wireless bandwidth consumption under adverse network conditions.

2. Problem Formulation and Bandwidth Constraints
Traditional cloud-reliant autonomous pipelines suffer from unpredictable round-trip packet latency and intermittent connectivity drops. In high-speed autonomous vehicular corridors, a 100ms transmission delay can result in catastrophic navigation hazards. Furthermore, transmitting gigabytes of uncompressed point-cloud LiDAR streams saturates local 5G cellular uplinks, increasing operating expenses.

3. Proposed Edge-Native Architecture
Our proposed system introduces a two-tier hierarchical arbitration layer. First, localized telemetry is quantized using 8-bit integer weights and evaluated directly on embedded edge clusters. Second, a speculative compression protocol dynamically filters redundant spatial frames before transmitting metadata to the supervisory coordinator.

4. Experimental Results and Performance Analysis
Extensive benchmarking across 1,000 synthetic test cycles revealed consistent real-time responsiveness. P99 latency dropped from 148ms in pure-cloud baselines to 12.4ms with edge arbitration. Energy efficiency improved by 2.1x per computed trajectory.

5. Conclusions and Future Research
Edge computing represents an essential paradigm shift for mission-critical autonomy. Future research will explore decentralized multi-agent consensus and post-quantum cryptographic verification across ad-hoc wireless mesh links.`,
        metadata: {
          filename: 'Edge_AI_Research_Paper.pdf',
          file_type: 'pdf',
          file_size_bytes: 2048,
          page_count: 1,
          character_count: 1650,
          word_count: 230,
          is_scanned: false,
          extraction_method: 'sample_document',
        },
      },
      meeting_notes: {
        text: `QUARTERLY PRODUCT STRATEGY NOTES
Date: August 2026 | Location: San Francisco Office
----------------------------------------------------------------

Key Deliverables for Q3 2026:
1. Launch Document Summary Assistant to production beta.
2. Implement PyMuPDF and Tesseract OCR for multi-format text ingestion.
3. Integrate Google Gemini API with Short, Medium, and Long summary modes.
4. Optimize response times to maintain sub-2 second latency.
5. Conduct security audit: ensure zero temporary file leakage.

Action Items:
- Backend team: finalize Map-Reduce chunking for documents over 100 pages.
- Frontend team: complete dark mode polish and export modal (Markdown, Text, JSON, PDF).
- DevOps: set up staging deployment pipeline on Render (backend) and Vercel (frontend).
- QA: run end-to-end tests with real Gemini API key across all summary lengths.

Risk Factors:
- Tesseract OCR may not be available on all deployment targets; Gemini Vision fallback is essential.
- Rate limiting on free Gemini API tier during high-concurrency testing windows.
- Large scanned PDFs (>50 pages) need aggressive chunking to fit within model token limits.

Next Steps:
- Deploy frontend to Vercel and backend to Render.
- Finalize documentation and user guide.
- Schedule load testing for week of September 1st.`,
        metadata: {
          filename: 'Strategy_Notes.png',
          file_type: 'png',
          file_size_bytes: 1024,
          page_count: 1,
          character_count: 980,
          word_count: 145,
          is_scanned: true,
          extraction_method: 'sample_document',
        },
      },
    };

    const sample = samples[sampleType];
    if (!sample) return;

    setErrorMessage('');
    setCurrentFile(null);
    setCurrentStage('upload');
    setUploadProgress(0);
    setExtractedData(null);
    setAnalysisResult(null);

    try {
      // Simulate upload + extraction stages visually
      setUploadProgress(100);
      setCurrentStage('extract');
      await new Promise((r) => setTimeout(r, 500));

      setExtractedData({
        success: true,
        extracted_text: sample.text,
        metadata: sample.metadata,
        message: 'Sample text loaded.',
      });

      // Move to AI analysis
      setCurrentStage('analyze');
      await new Promise((r) => setTimeout(r, 400));
      setCurrentStage('summarize');

      const analysis = await summarizeDocument({
        text: sample.text,
        summaryLength: selectedLength,
        metadata: sample.metadata,
      });

      setAnalysisResult(analysis);
      setCurrentStage('complete');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Sample processing error:', err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'An error occurred while processing the sample document. Please try again.';
      setErrorMessage(msg);
      setCurrentStage('error');
    }
  };

  // Reset to Upload View
  const handleReset = () => {
    setCurrentStage('idle');
    setUploadProgress(0);
    setErrorMessage('');
    setCurrentFile(null);
    setExtractedData(null);
    setAnalysisResult(null);
    setSelectedLength('medium');
    setIsRegenerating(false);
  };

  const isLoading = ['upload', 'extract', 'ocr', 'analyze', 'summarize'].includes(currentStage);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Navigation Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
        backendHealth={backendHealth}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Hero Section (When in Upload / Idle state) */}
        {currentStage === 'idle' && (
          <div className="text-center space-y-3 max-w-3xl mx-auto pt-2 pb-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Transform Complex Documents into{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-teal-400">
                Actionable Intelligence
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload PDF documents or scanned images. Our pipeline extracts high-fidelity text, performs OCR, and leverages Google Gemini AI to generate executive summaries, key takeaways, dynamic outlines, and editorial suggestions.
            </p>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <ErrorAlert
            error={errorMessage}
            onRetry={currentFile ? () => handleProcessFile(currentFile) : null}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onDismiss={() => setErrorMessage('')}
          />
        )}

        {/* Upload View */}
        {(currentStage === 'idle' || currentStage === 'error') && (
          <FileUpload
            onFileSelected={handleProcessFile}
            isLoading={isLoading}
            onSelectSample={handleSelectSample}
          />
        )}

        {/* Multi-stage Progress Stepper */}
        {isLoading && (
          <ProcessingProgress
            currentStage={currentStage}
            uploadProgress={uploadProgress}
            isScanned={extractedData?.metadata?.is_scanned || false}
          />
        )}

        {/* Results Dashboard */}
        {currentStage === 'complete' && analysisResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Document Metadata Bar */}
            <DocumentMeta
              metadata={analysisResult.metadata}
              onReset={handleReset}
              onOpenExport={() => setIsExportModalOpen(true)}
            />

            {/* Summary Length Controls */}
            <SummaryLengthSelector
              currentLength={selectedLength}
              onLengthChange={handleLengthChange}
              isRegenerating={isRegenerating}
            />

            {/* AI Summary Card */}
            <SummaryCard
              summary={analysisResult.summary}
              summaryLength={analysisResult.summary_length}
              isHierarchical={analysisResult.is_hierarchical}
            />

            {/* Key Points Bullet List */}
            <KeyPointsCard keyPoints={analysisResult.key_points} />

            {/* Main Ideas & Outlines */}
            <MainIdeasCard mainIdeas={analysisResult.main_ideas} />

            {/* Improvement Suggestions */}
            <ImprovementSuggestionsCard suggestions={analysisResult.improvement_suggestions} />

            {/* Raw Extracted Text Viewer */}
            <ExtractedTextViewer
              extractedText={analysisResult.extracted_text}
              metadata={analysisResult.metadata}
            />

          </div>
        )}

      </main>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(hasKey) => setHasApiKey(hasKey)}
        backendHasKey={Boolean(backendHealth?.gemini_configured)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={analysisResult}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <p>
          Document Summary Assistant • Production AI Architecture with PyMuPDF, Tesseract OCR & Google Gemini
        </p>
      </footer>

    </div>
  );
}
