"""Generate synthetic sample documents (PDFs, Images, Scanned PDFs) for testing and evaluation."""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from PIL import Image, ImageDraw, ImageFont
import fitz

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "samples")
os.makedirs(SAMPLES_DIR, exist_ok=True)


def create_sample_text_pdf(filename: str = "sample_ai_research.pdf") -> str:
    """Create a high-quality 2-page research PDF with clear sections."""
    output_path = os.path.join(SAMPLES_DIR, filename)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Title"],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=12,
    )
    heading_style = ParagraphStyle(
        "CustomHeading",
        parent=styles["Heading2"],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0f766e"),
        spaceBefore=14,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "CustomBody",
        parent=styles["Normal"],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=8,
    )

    story = []

    # Title
    story.append(Paragraph("Advancements in Edge Computing and Autonomous Systems", title_style))
    story.append(Paragraph("<b>Author:</b> Dr. Elena Rostova | <b>Published:</b> August 2026", body_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=14))

    # Abstract
    story.append(Paragraph("1. Executive Abstract", heading_style))
    story.append(
        Paragraph(
            "This paper investigates the convergence of distributed edge intelligence and modern autonomous control architectures. "
            "Recent advancements in low-power neural processing units (NPUs) enable real-time inference at sub-millisecond latencies, "
            "drastically reducing reliance on centralized cloud backbones. We demonstrate an end-to-end framework achieving a 42% decrease in latency "
            "and a 35% reduction in wireless bandwidth consumption under adverse network conditions.",
            body_style,
        )
    )

    # Problem Statement
    story.append(Paragraph("2. Problem Formulation and Bandwidth Constraints", heading_style))
    story.append(
        Paragraph(
            "Traditional cloud-reliant autonomous pipelines suffer from unpredictable round-trip packet latency and intermittent connectivity drops. "
            "In high-speed autonomous vehicular corridors, a 100ms transmission delay can result in catastrophic navigation hazards. "
            "Furthermore, transmitting gigabytes of uncompressed point-cloud LiDAR streams saturates local 5G cellular uplinks, increasing operating expenses.",
            body_style,
        )
    )

    story.append(Spacer(1, 14))

    # Methodology
    story.append(Paragraph("3. Proposed Edge-Native Architecture", heading_style))
    story.append(
        Paragraph(
            "Our proposed system introduces a two-tier hierarchical arbitration layer. First, localized telemetry is quantized using 8-bit integer weights "
            "and evaluated directly on embedded edge clusters. Second, a speculative compression protocol dynamically filters redundant spatial frames "
            "before transmitting metadata to the supervisory coordinator.",
            body_style,
        )
    )

    # Key Results
    story.append(Paragraph("4. Experimental Results and Performance Analysis", heading_style))
    story.append(
        Paragraph(
            "Extensive benchmarking across 1,000 synthetic test cycles revealed consistent real-time responsiveness. "
            "P99 latency dropped from 148ms in pure-cloud baselines to 12.4ms with edge arbitration. "
            "Energy efficiency improved by 2.1x per computed trajectory.",
            body_style,
        )
    )

    # Conclusion & Recommendations
    story.append(Paragraph("5. Conclusions and Future Research", heading_style))
    story.append(
        Paragraph(
            "Edge computing represents an essential paradigm shift for mission-critical autonomy. Future research will explore decentralized multi-agent consensus "
            "and post-quantum cryptographic verification across ad-hoc wireless mesh links.",
            body_style,
        )
    )

    doc.build(story)
    return output_path


def create_sample_ocr_image(filename: str = "sample_meeting_notes.png") -> str:
    """Create a synthetic PNG image with high-contrast printed text to test OCR."""
    output_path = os.path.join(SAMPLES_DIR, filename)
    width, height = 800, 600
    img = Image.new("RGB", (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    lines = [
        "QUARTERLY PRODUCT STRATEGY NOTES",
        "Date: August 2026 | Location: San Francisco Office",
        "----------------------------------------------------------------",
        "",
        "Key Deliverables for Q3 2026:",
        "1. Launch Document Summary Assistant to production beta.",
        "2. Implement PyMuPDF and Tesseract OCR for multi-format text ingestion.",
        "3. Integrate Google Gemini API with Short, Medium, and Long summary modes.",
        "4. Optimize response times to maintain sub-2 second latency.",
        "5. Conduct security audit: ensure zero temporary file leakage.",
        "",
        "Next Steps:",
        "- Deploy frontend to Vercel and backend to Render.",
        "- Finalize documentation and user guide.",
    ]

    y = 40
    for line in lines:
        draw.text((40, y), line, fill=(15, 23, 42))
        y += 32

    img.save(output_path, "PNG")
    return output_path


def create_sample_scanned_pdf(filename: str = "sample_scanned_invoice.pdf") -> str:
    """Create a scanned-style PDF containing an image of text rather than native PDF text."""
    output_path = os.path.join(SAMPLES_DIR, filename)
    
    # First create an image
    img_width, img_height = 800, 1000
    img = Image.new("RGB", (img_width, img_height), color=(250, 250, 250))
    draw = ImageDraw.Draw(img)

    text_lines = [
        "SCANNED INVOICE & WORK ORDER #84920",
        "Client: Acme Global Enterprises",
        "Issue Date: August 15, 2026",
        "",
        "Item 1: Document Processing Pipeline Design - $4,500.00",
        "Item 2: OCR Fallback Implementation - $2,200.00",
        "Item 3: AI Summarization & Key Points Module - $3,800.00",
        "",
        "Subtotal: $10,500.00",
        "Tax (8%): $840.00",
        "Total Balance Due: $11,340.00",
        "",
        "Payment Terms: Net 30 Days via Wire Transfer.",
    ]

    y = 60
    for line in text_lines:
        draw.text((60, y), line, fill=(30, 41, 59))
        y += 40

    temp_img_path = os.path.join(SAMPLES_DIR, "_temp_scan.png")
    img.save(temp_img_path, "PNG")

    # Embed the image into a PDF with PyMuPDF
    pdf_doc = fitz.open()
    page = pdf_doc.new_page(width=img_width, height=img_height)
    page.insert_image(fitz.Rect(0, 0, img_width, img_height), filename=temp_img_path)
    pdf_doc.save(output_path)
    pdf_doc.close()

    if os.path.exists(temp_img_path):
        os.remove(temp_img_path)

    return output_path


def generate_all_samples():
    """Generate all test files in tests/samples/."""
    pdf_path = create_sample_text_pdf()
    img_path = create_sample_ocr_image()
    scanned_path = create_sample_scanned_pdf()
    print(f"Generated samples:\n - {pdf_path}\n - {img_path}\n - {scanned_path}")


if __name__ == "__main__":
    generate_all_samples()
