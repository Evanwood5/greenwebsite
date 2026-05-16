import fitz  # PyMuPDF
from io import BytesIO
from presidio_analyzer import AnalyzerEngine
from presidio_analyzer.nlp_engine import NlpEngineProvider
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
import re
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response

# ============================================================
# SAFE WORD WHITELIST
# Words that look like Title Case names but are NOT names.
# Add any false positives here.
# ============================================================
NAME_WHITELIST = {
    # Job titles
    "Software", "Engineer", "Developer", "Manager", "Director", "Senior",
    "Junior", "Lead", "Principal", "Staff", "Intern", "Associate", "Analyst",
    "Consultant", "Specialist", "Coordinator", "Supervisor", "President",
    "Vice", "Chief", "Head", "Officer", "Executive", "Architect", "Designer",
    "Researcher", "Scientist", "Administrator", "Representative", "Advisor",
    # Education
    "Bachelor", "Master", "Doctor", "University", "College", "School",
    "Institute", "Department", "Faculty", "Professor", "Science", "Arts",
    "Engineering", "Business", "Technology", "Computer", "Information",
    # Tech terms
    "Python", "Java", "React", "Angular", "Node", "Docker", "Kubernetes",
    "Amazon", "Google", "Microsoft", "Apple", "Meta", "Github", "Linux",
    "Windows", "Android", "Swift", "Kotlin", "Typescript", "Javascript",
    "Machine", "Learning", "Artificial", "Intelligence", "Neural", "Network",
    "Database", "Server", "Cloud", "Security", "Frontend", "Backend",
    "Fullstack", "Mobile", "Web", "Api", "Rest", "Sql", "Nosql",
    # Common words
    "The", "And", "For", "With", "From", "This", "That", "These", "Those",
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    # Months abbreviated
    "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    # Other
    "Present", "Current", "Remote", "Hybrid", "Full", "Part", "Time",
    "Project", "Team", "Product", "Development", "Management", "Operations",
    "Experience", "Education", "Skills", "Summary", "Objective", "References",
    "Certifications", "Awards", "Publications", "Languages", "Interests",
    "Responsibilities", "Achievements", "Accomplishments", "Overview",
    "Michigan", "Detroit", "Chicago", "York", "Angeles", "Francisco",
    "United", "States", "America", "North", "South", "East", "West",
    "Inc", "Corp", "Llc", "Ltd", "Company", "Group", "Solutions", "Services",
    "International", "Global", "National", "Regional", "Local",
    "Advanced", "General", "Special", "Technical", "Digital", "Data",
    "Health", "Medical", "Financial", "Legal", "Human", "Resources",
    "Redacted", "Location", "Phone", "Email", "Date", "Address", "Zip",
    "Profile", "Url", "License", "Ssn",
}


def redact_header_block(text: str) -> str:
    """
    Unconditionally redact the first 5 non-empty lines of the resume.
    These always contain: name, email, phone, city, LinkedIn/GitHub.
    This is the most reliable catch for unique names like 'Adiva Jain'.
    """
    lines = text.split('\n')
    non_empty_count = 0
    result = []
    
    for line in lines:
        if non_empty_count < 5 and line.strip():
            # Redact the entire line — these are always contact info
            result.append('[HEADER REDACTED]')
            non_empty_count += 1
        else:
            result.append(line)
    
    return '\n'.join(result)


def redact_title_case_names(text: str) -> str:
    """
    Catch names that Presidio missed by scanning for sequences of
    2+ consecutive Title Case words that are not in the whitelist.
    Covers non-Western names like 'Adiva Jain', 'Priya Patel', 'Wei Zhang'.
    """
    # Match 2-4 consecutive Title Case words (e.g. "Adiva Jain", "Mary Jane Watson")
    pattern = r'\b([A-Z][a-z]{1,20})(?:\s+([A-Z][a-z]{1,20})){1,3}\b'
    
    def replace_if_name(match):
        full_match = match.group(0)
        words = full_match.split()
        # If ALL words are in the whitelist, it's not a name
        if all(w in NAME_WHITELIST for w in words):
            return full_match
        # If ANY word is NOT in the whitelist, treat the whole thing as a name
        return '[REDACTED]'
    
    return re.sub(pattern, replace_if_name, text)


def strip_resume_pii(pdf_bytes):
    """
    Strip PII from a resume PDF using:
    1. Header block redaction (catches name unconditionally)
    2. Regex patterns (emails, phones, URLs, addresses)
    3. Presidio ML-based NER (catches structured PII)
    4. Title Case name sweep (catches non-Western names Presidio misses)
    """
    
    try:
        print(f"[DEBUG] Processing PDF blob of {len(pdf_bytes)} bytes")
        
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        print(f"[DEBUG] PDF opened successfully, {pdf_doc.page_count} pages")
        
        full_text = ""
        for page_num in range(pdf_doc.page_count):
            page = pdf_doc[page_num]
            full_text += page.get_text("text") + "\n"
        
        pdf_doc.close()
        print(f"[DEBUG] Extracted {len(full_text)} characters of text")
        
        # ============================================================
        # LAYER 1 — Header block (name always here, redact unconditionally)
        # ============================================================
        print("[DEBUG] Layer 1: Redacting header block...")
        full_text = redact_header_block(full_text)
        
        # ============================================================
        # LAYER 2 — Regex patterns
        # ============================================================
        print("[DEBUG] Layer 2: Applying regex patterns...")

        # Emails
        full_text = re.sub(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', '[EMAIL REDACTED]', full_text)

        # Phone numbers (various formats)
        full_text = re.sub(r'(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}', '[PHONE REDACTED]', full_text)

        # GitHub URLs and usernames
        full_text = re.sub(r'https?://(?:www\.)?github\.com/[a-zA-Z0-9\-]+(?:/[a-zA-Z0-9\-._~:/?#\[\]@!$&\'()*+,;%=]*)?', '[GITHUB REDACTED]', full_text)
        full_text = re.sub(r'github\.com/[a-zA-Z0-9\-]+', '[GITHUB REDACTED]', full_text)

        # LinkedIn URLs and profile paths
        full_text = re.sub(r'https?://(?:www\.)?linkedin\.com/in/[a-zA-Z0-9\-]+/?', '[LINKEDIN REDACTED]', full_text)
        full_text = re.sub(r'linkedin\.com/in/[a-zA-Z0-9\-]+', '[LINKEDIN REDACTED]', full_text)
        full_text = re.sub(r'/in/[a-zA-Z0-9\-]+', '[PROFILE REDACTED]', full_text)

        # Generic URLs that might contain username
        full_text = re.sub(r'https?://[a-zA-Z0-9\-._~:/?#\[\]@!$&\'()*+,;%=]+', '[URL REDACTED]', full_text)

        # Street addresses
        full_text = re.sub(r'\b\d+\s+[A-Z][a-zA-Z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Court|Ct)\.?\b', '[ADDRESS REDACTED]', full_text, flags=re.IGNORECASE)

        # Zip codes
        full_text = re.sub(r'\b\d{5}(?:-\d{4})?\b', '[ZIP REDACTED]', full_text)

        # City, STATE format
        full_text = re.sub(r'\b[A-Z][a-zA-Z\s]+,\s+[A-Z]{2}\b', '[LOCATION REDACTED]', full_text)

        # All-caps city names with comma
        full_text = re.sub(r'\b[A-Z]+(?:\s+[A-Z]+){0,2},', '[LOCATION REDACTED],', full_text)

        # Date ranges
        full_text = re.sub(r'\b\d{4}\s*[-\u2013\u2014]\s*(?:\d{4}|Present|present|Current|current)\b', '[DATE REDACTED]', full_text)
        full_text = re.sub(r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2},?\s*\d{4}\b', '[DATE REDACTED]', full_text, flags=re.IGNORECASE)
        full_text = re.sub(r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{4}\b', '[DATE REDACTED]', full_text, flags=re.IGNORECASE)

        print("[DEBUG] Layer 2 regex complete")

        # ============================================================
        # LAYER 3 — Presidio ML-based NER
        # ============================================================
        print("[DEBUG] Layer 3: Running Presidio NER...")
        nlp_configuration = {
            "nlp_engine_name": "spacy",
            "models": [{"lang_code": "en", "model_name": "en_core_web_sm"}]
        }
        nlp_engine = NlpEngineProvider(nlp_configuration=nlp_configuration).create_engine()
        analyzer = AnalyzerEngine(nlp_engine=nlp_engine)
        anonymizer = AnonymizerEngine()

        results = analyzer.analyze(
            text=full_text,
            language='en',
            entities=[
                "PERSON", "PHONE_NUMBER", "EMAIL_ADDRESS", "LOCATION",
                "DATE_TIME", "URL", "US_SSN", "US_DRIVER_LICENSE",
            ]
        )
        
        print(f"[DEBUG] Presidio detected {len(results)} PII entities")
        
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
        
        anonymized_result = anonymizer.anonymize(
            text=full_text,
            analyzer_results=results,
            operators=operators
        )
        
        cleaned_text = anonymized_result.text
        print("[DEBUG] Layer 3 Presidio complete")

        # ============================================================
        # LAYER 4 — Title Case name sweep (catches non-Western names)
        # ============================================================
        print("[DEBUG] Layer 4: Title Case name sweep...")
        cleaned_text = redact_title_case_names(cleaned_text)
        print("[DEBUG] Layer 4 complete")

        # ============================================================
        # FORMATTING — Rebuild PDF
        # ============================================================
        lines = cleaned_text.split('\n')
        formatted_lines = []
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if (len(line) < 50 and
                (line.isupper() or
                 (line[0].isupper() and line.count(' ') <= 3))):
                formatted_lines.append('')
                formatted_lines.append(line.upper())
            elif re.match(r'^[\u2022\u2023\u25E6\u2043\u2219\u2022\u00b7\-\*]\s', line) or re.match(r'^\d+[\.\)]\s', line):
                formatted_lines.append('  ' + line)
            else:
                formatted_lines.append(line)

        new_pdf = fitz.open()
        page_width = 612
        page_height = 792
        margin_left = 36
        margin_right = 36
        margin_top = 36
        margin_bottom = 36
        font_name = "helv"
        font_size = 9
        line_height = font_size * 1.15
        usable_width = page_width - margin_left - margin_right

        current_page = new_pdf.new_page(width=page_width, height=page_height)
        current_y = margin_top
        lines_inserted = 0

        for line in formatted_lines:
            if current_y + line_height > page_height - margin_bottom:
                current_page = new_pdf.new_page(width=page_width, height=page_height)
                current_y = margin_top

            if not line.strip():
                current_y += line_height * 0.3
                continue

            is_header = line.isupper() and len(line) < 50
            line_font_size = font_size + 1 if is_header else font_size
            max_chars_per_line = int(usable_width / (line_font_size * 0.5))

            if len(line) > max_chars_per_line:
                words = line.split()
                current_line = ""
                for word in words:
                    test_line = current_line + " " + word if current_line else word
                    if len(test_line) <= max_chars_per_line:
                        current_line = test_line
                    else:
                        if current_line:
                            try:
                                current_page.insert_text(
                                    (margin_left, current_y + line_font_size),
                                    current_line, fontsize=line_font_size,
                                    fontname=font_name, color=(0, 0, 0)
                                )
                                lines_inserted += 1
                            except Exception as e:
                                print(f"[DEBUG] Error: {e}")
                            current_y += line_height
                            if current_y + line_height > page_height - margin_bottom:
                                current_page = new_pdf.new_page(width=page_width, height=page_height)
                                current_y = margin_top
                        current_line = word
                if current_line:
                    try:
                        current_page.insert_text(
                            (margin_left, current_y + line_font_size),
                            current_line, fontsize=line_font_size,
                            fontname=font_name, color=(0, 0, 0)
                        )
                        lines_inserted += 1
                    except Exception as e:
                        print(f"[DEBUG] Error: {e}")
                    current_y += line_height
            else:
                try:
                    current_page.insert_text(
                        (margin_left, current_y + line_font_size),
                        line, fontsize=line_font_size,
                        fontname=font_name, color=(0, 0, 0)
                    )
                    lines_inserted += 1
                except Exception as e:
                    print(f"[DEBUG] Error: {e}")
                current_y += line_height

        print(f"[DEBUG] Created {new_pdf.page_count} pages with {lines_inserted} lines")

        output_buffer = BytesIO()
        new_pdf.save(output_buffer)
        output_bytes = output_buffer.getvalue()
        new_pdf.close()

        print(f"[DEBUG] SUCCESS - Returning anonymized PDF ({len(output_bytes)} bytes)")
        return output_bytes

    except Exception as e:
        print(f"[ERROR] Presidio processing failed: {e}")
        import traceback
        traceback.print_exc()
        return pdf_bytes


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(title="PII Stripping Service")

@app.post("/strip-pii")
async def strip_pii_endpoint(file: UploadFile = File(...)):
    print(f"[API] Received file: {file.filename}")
    pdf_bytes = await file.read()
    print(f"[API] File size: {len(pdf_bytes)} bytes")
    cleaned_pdf = strip_resume_pii(pdf_bytes)
    doc = fitz.open(stream=cleaned_pdf, filetype="pdf")
    cleaned_text = ""
    for page in doc:
        cleaned_text += page.get_text("text")
    doc.close()
    print(f"[API] Returning {len(cleaned_text)} characters of text")
    return {"text": cleaned_text, "success": True}

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "PII Stripping Service", "version": "2.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}
