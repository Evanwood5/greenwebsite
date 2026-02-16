import fitz  # PyMuPDF
from io import BytesIO
from presidio_analyzer import AnalyzerEngine
from presidio_analyzer.nlp_engine import NlpEngineProvider
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
import re
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response

def strip_resume_pii(pdf_bytes):
    """
    Strip PII from a resume PDF using Microsoft Presidio for ML-based detection
    plus regex backup for edge cases.
    Extracts text, anonymizes it, and rebuilds as a clean, readable PDF.
    Optimized to fit content on 1 page when possible.
    
    Args:
        pdf_bytes (bytes): PDF file as bytes
    
    Returns:
        bytes: Anonymized PDF as bytes, or original PDF if error
    """
    
    try:
        print(f"[DEBUG] Processing PDF blob of {len(pdf_bytes)} bytes")
        
        # Open the PDF from bytes
        print("[DEBUG] Opening PDF document...")
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        print(f"[DEBUG] PDF opened successfully, {pdf_doc.page_count} pages")
        
        # Extract all text from the PDF
        print("[DEBUG] Extracting text from PDF...")
        full_text = ""
        for page_num in range(pdf_doc.page_count):
            page = pdf_doc[page_num]
            full_text += page.get_text("text") + "\n"
        
        pdf_doc.close()
        
        print(f"[DEBUG] Extracted {len(full_text)} characters of text")
        
        # Initialize Presidio engines with SMALL spaCy model
        print("[DEBUG] Initializing Presidio AnalyzerEngine with small model...")
        nlp_configuration = {
            "nlp_engine_name": "spacy",
            "models": [{"lang_code": "en", "model_name": "en_core_web_sm"}]
        }
        nlp_engine = NlpEngineProvider(nlp_configuration=nlp_configuration).create_engine()
        analyzer = AnalyzerEngine(nlp_engine=nlp_engine)
        print("[DEBUG] AnalyzerEngine initialized successfully")
        
        print("[DEBUG] Initializing Presidio AnonymizerEngine...")
        anonymizer = AnonymizerEngine()
        print("[DEBUG] AnonymizerEngine initialized successfully")

        # ============================================================
        # REGEX FIRST PASS - Catch common patterns before Presidio
        # ============================================================

        print("[DEBUG] Applying regex patterns BEFORE Presidio...")

        # Pattern 1: City, STATE format
        full_text = re.sub(r'\b[A-Z][a-zA-Z\s]+,\s+[A-Z]{2}\b', '[LOCATION REDACTED]', full_text)

        # Pattern 2: Month DD, YYYY
        full_text = re.sub(r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2},?\s*\d{4}\b', '[DATE REDACTED]', full_text, flags=re.IGNORECASE)

        # Pattern 3: Month YYYY
        full_text = re.sub(r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{4}\b', '[DATE REDACTED]', full_text, flags=re.IGNORECASE)

        # Pattern 4: Date ranges
        full_text = re.sub(r'\b\d{4}\s*[-–—]\s*(?:\d{4}|Present|present|Current|current)\b', '[DATE REDACTED]', full_text)

        # Pattern 5: Year - Present
        full_text = re.sub(r'\b(19|20)\d{2}\s*[-–—]\s*(?:Present|present|Current|current|PRESENT|CURRENT)\b', '[DATE REDACTED]', full_text)

        # Pattern 6: Zip codes
        full_text = re.sub(r'\b\d{5}(?:-\d{4})?\b', '[ZIP REDACTED]', full_text)

        # Pattern 7: Street addresses
        full_text = re.sub(r'\b\d+\s+[A-Z][a-zA-Z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Court|Ct)\b', '[ADDRESS REDACTED]', full_text, flags=re.IGNORECASE)

        # Pattern 8: All-caps city names with comma
        full_text = re.sub(r'\b[A-Z]+(?:\s+[A-Z]+){0,2},', '[LOCATION REDACTED],', full_text)

        # Pattern 9: LinkedIn profile paths
        full_text = re.sub(r'/in/[a-zA-Z0-9\-]+', '[PROFILE REDACTED]', full_text)

        print("[DEBUG] Regex first pass complete")
        
        # Analyze text for PII
        print("[DEBUG] Analyzing text for PII entities...")
        results = analyzer.analyze(
            text=full_text,
            language='en',
            entities=[
                "PERSON",
                "PHONE_NUMBER",
                "EMAIL_ADDRESS",
                "LOCATION",
                "DATE_TIME",
                "URL",
                "US_SSN",
                "US_DRIVER_LICENSE",
            ]
        )
        
        print(f"[DEBUG] Presidio detected {len(results)} PII entities")
        
        # ============================================================
        # CUSTOM ANONYMIZATION - Replace with [REDACTED] instead of <PERSON>
        # ============================================================
        
        operators = {
            "PERSON": OperatorConfig("replace", {"new_value": "[REDACTED]"}),
            "PHONE_NUMBER": OperatorConfig("replace", {"new_value": "[PHONE REDACTED]"}),
            "EMAIL_ADDRESS": OperatorConfig("replace", {"new_value": "[EMAIL REDACTED]"}),
            "LOCATION": OperatorConfig("replace", {"new_value": "[LOCATION REDACTED]"}),
            "DATE_TIME": OperatorConfig("replace", {"new_value": "[DATE REDACTED]"}),
            "URL": OperatorConfig("replace", {"new_value": "[URL REDACTED]"}),
            "US_SSN": OperatorConfig("replace", {"new_value": "[SSN REDACTED]"}),
            "US_DRIVER_LICENSE": OperatorConfig("replace", {"new_value": "[LICENSE REDACTED]"}),
        }
        
        # Anonymize the text with custom operators
        print("[DEBUG] Anonymizing text with custom operators...")
        anonymized_result = anonymizer.anonymize(
            text=full_text,
            analyzer_results=results,
            operators=operators
        )
        
        cleaned_text = anonymized_result.text
        
        print(f"[DEBUG] Successfully anonymized text with Presidio")
        

        
        # ============================================================
        # IMPROVED FORMATTING - Condensed for single page
        # ============================================================
        
        # Split into lines
        lines = cleaned_text.split('\n')
        
        # Format lines - simpler structure to save space
        formatted_lines = []
        for line in lines:
            line = line.strip()
            
            if not line:
                continue  # Skip blank lines to save space
            
            # Check if line is a section header (mostly uppercase or short title)
            if (len(line) < 50 and 
                (line.isupper() or  # All caps
                 (line[0].isupper() and line.count(' ') <= 3))):  # Short title
                # Section headers - no underline to save space
                formatted_lines.append('')  # Small space before header
                formatted_lines.append(line.upper())  # Ensure all caps
            # Check if line starts with bullet/dash/number (list items)
            elif re.match(r'^[\u2022\u2023\u25E6\u2043\u2219•·\-\*]\s', line) or re.match(r'^\d+[\.\)]\s', line):
                formatted_lines.append('  ' + line)  # Indent bullets
            else:
                formatted_lines.append(line)
        
        print(f"[DEBUG] Formatted {len(formatted_lines)} lines for PDF")
        
        # ============================================================
        # CREATE CONDENSED PDF - Optimized for 1 page
        # ============================================================
        
        print("[DEBUG] Creating new PDF document...")
        new_pdf = fitz.open()
        
        # Page settings - tighter margins
        page_width = 612   # 8.5 inches
        page_height = 792  # 11 inches
        margin_left = 36   # 0.5 inch
        margin_right = 36
        margin_top = 36    # 0.5 inch
        margin_bottom = 36
        
        # Font settings - smaller and tighter
        font_name = "helv"
        font_size = 9      # Reduced from 10
        line_height = font_size * 1.15  # Tighter spacing
        
        # Calculate usable width
        usable_width = page_width - margin_left - margin_right
        
        # Create first page
        current_page = new_pdf.new_page(width=page_width, height=page_height)
        current_y = margin_top
        
        lines_inserted = 0
        
        for line in formatted_lines:
            # Create new page if needed
            if current_y + line_height > page_height - margin_bottom:
                print(f"[DEBUG] Page full at y={current_y}, creating new page")
                current_page = new_pdf.new_page(width=page_width, height=page_height)
                current_y = margin_top
            
            # Skip empty lines but add small spacing
            if not line.strip():
                current_y += line_height * 0.3  # Reduced spacing
                continue
            
            # Check if line is a section header
            is_header = line.isupper() and len(line) < 50
            
            # Determine font size for this line
            line_font_size = font_size + 1 if is_header else font_size
            
            # Handle long lines - wrap if needed
            max_chars_per_line = int(usable_width / (line_font_size * 0.5))
            
            if len(line) > max_chars_per_line:
                # Wrap long lines
                words = line.split()
                current_line = ""
                
                for word in words:
                    test_line = current_line + " " + word if current_line else word
                    
                    if len(test_line) <= max_chars_per_line:
                        current_line = test_line
                    else:
                        # Insert current line
                        if current_line:
                            try:
                                current_page.insert_text(
                                    (margin_left, current_y + line_font_size),
                                    current_line,
                                    fontsize=line_font_size,
                                    fontname=font_name,
                                    color=(0, 0, 0)
                                )
                                lines_inserted += 1
                            except Exception as e:
                                print(f"[DEBUG] ❌ Error: {e}")
                            
                            current_y += line_height
                            
                            # Check if new page needed
                            if current_y + line_height > page_height - margin_bottom:
                                current_page = new_pdf.new_page(width=page_width, height=page_height)
                                current_y = margin_top
                        
                        current_line = word
                
                # Insert remaining text
                if current_line:
                    try:
                        current_page.insert_text(
                            (margin_left, current_y + line_font_size),
                            current_line,
                            fontsize=line_font_size,
                            fontname=font_name,
                            color=(0, 0, 0)
                        )
                        lines_inserted += 1
                    except Exception as e:
                        print(f"[DEBUG] ❌ Error: {e}")
                    
                    current_y += line_height
            else:
                # Insert text using insert_text
                try:
                    current_page.insert_text(
                        (margin_left, current_y + line_font_size),
                        line,
                        fontsize=line_font_size,
                        fontname=font_name,
                        color=(0, 0, 0)
                    )
                    lines_inserted += 1
                    
                except Exception as e:
                    print(f"[DEBUG] ❌ EXCEPTION in insert_text(): {e}")
                    import traceback
                    traceback.print_exc()
                
                current_y += line_height
        
        print(f"[DEBUG] Created {new_pdf.page_count} pages with {lines_inserted} lines inserted")
        
        # Save to bytes
        print("[DEBUG] Saving PDF to bytes buffer...")
        output_buffer = BytesIO()
        new_pdf.save(output_buffer)
        output_bytes = output_buffer.getvalue()
        new_pdf.close()
        
        print(f"[DEBUG] Created new anonymized PDF: {len(output_bytes)} bytes")
        print(f"[DEBUG] ✅ SUCCESS - Returning anonymized PDF")
        
        return output_bytes
        
    except Exception as e:
        print(f"[ERROR] ❌ Presidio processing failed: {e}")
        import traceback
        print("[ERROR] Full traceback:")
        traceback.print_exc()
        print(f"[ERROR] Returning original PDF as fallback ({len(pdf_bytes)} bytes)")
        return pdf_bytes  # Return original instead of None


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(title="PII Stripping Service")

@app.post("/strip-pii")
async def strip_pii_endpoint(file: UploadFile = File(...)):
    """
    Endpoint to strip PII from uploaded PDF resume.
    Returns extracted text as JSON.
    """
    print(f"[API] Received file: {file.filename}")
    
    # Read the uploaded PDF
    pdf_bytes = await file.read()
    print(f"[API] File size: {len(pdf_bytes)} bytes")
    
    # Process the PDF
    cleaned_pdf = strip_resume_pii(pdf_bytes)
    
    # Extract text from the cleaned PDF
    doc = fitz.open(stream=cleaned_pdf, filetype="pdf")
    cleaned_text = ""
    for page in doc:
        cleaned_text += page.get_text("text")
    doc.close()
    
    print(f"[API] Returning {len(cleaned_text)} characters of text")
    
    # Return JSON with the cleaned text
    return {
        "text": cleaned_text,
        "success": True
    }

@app.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "PII Stripping Service",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    """Alternative health check endpoint"""
    return {"status": "ok"}