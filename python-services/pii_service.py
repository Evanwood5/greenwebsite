from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
from io import BytesIO
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
import re

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Presidio engines ONCE at startup (not inside function)
print("[DEBUG] Initializing Presidio engines...")
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()
print("[DEBUG] Presidio engines initialized successfully!")

def strip_resume_pii(pdf_bytes):
    """Strip PII from PDF using Presidio + regex"""
    try:
        print(f"[DEBUG] Processing PDF blob of {len(pdf_bytes)} bytes")
        
        # Open PDF
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        print(f"[DEBUG] PDF opened successfully, {pdf_doc.page_count} pages")
        
        # Extract text
        full_text = ""
        for page_num in range(pdf_doc.page_count):
            page = pdf_doc[page_num]
            full_text += page.get_text("text") + "\n"
        
        pdf_doc.close()
        print(f"[DEBUG] Extracted {len(full_text)} characters of text")
        
        # Regex first pass
        print("[DEBUG] Applying regex patterns...")
        
        # City, STATE format
        full_text = re.sub(r'\b[A-Z][a-zA-Z\s]+,\s+[A-Z]{2}\b', '[LOCATION REDACTED]', full_text)
        
        # Month DD, YYYY
        full_text = re.sub(r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2},?\s*\d{4}\b', '[DATE REDACTED]', full_text, flags=re.IGNORECASE)
        
        # Month YYYY
        full_text = re.sub(r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{4}\b', '[DATE REDACTED]', full_text, flags=re.IGNORECASE)
        
        # Date ranges
        full_text = re.sub(r'\b\d{4}\s*[-–—]\s*(?:\d{4}|Present|present|Current|current)\b', '[DATE REDACTED]', full_text)
        
        # Zip codes
        full_text = re.sub(r'\b\d{5}(?:-\d{4})?\b', '[ZIP REDACTED]', full_text)
        
        # Street addresses
        full_text = re.sub(r'\b\d+\s+[A-Z][a-zA-Z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Court|Ct)\b', '[ADDRESS REDACTED]', full_text, flags=re.IGNORECASE)
        
        # LinkedIn
        full_text = re.sub(r'/in/[a-zA-Z0-9\-]+', '[PROFILE REDACTED]', full_text)
        
        print("[DEBUG] Regex complete")
        
        # Presidio analysis (using global analyzer)
        print("[DEBUG] Running Presidio analysis...")
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
            ]
        )
        
        print(f"[DEBUG] Presidio detected {len(results)} PII entities")
        
        # Custom operators
        operators = {
            "PERSON": OperatorConfig("replace", {"new_value": "[NAME REDACTED]"}),
            "PHONE_NUMBER": OperatorConfig("replace", {"new_value": "[PHONE REDACTED]"}),
            "EMAIL_ADDRESS": OperatorConfig("replace", {"new_value": "[EMAIL REDACTED]"}),
            "LOCATION": OperatorConfig("replace", {"new_value": "[LOCATION REDACTED]"}),
            "DATE_TIME": OperatorConfig("replace", {"new_value": "[DATE REDACTED]"}),
            "URL": OperatorConfig("replace", {"new_value": "[URL REDACTED]"}),
        }
        
        # Anonymize (using global anonymizer)
        anonymized_result = anonymizer.anonymize(
            text=full_text,
            analyzer_results=results,
            operators=operators
        )
        
        cleaned_text = anonymized_result.text
        
        print(f"[DEBUG] ✅ SUCCESS - Returning anonymized text")
        return cleaned_text
        
    except Exception as e:
        print(f"[ERROR] ❌ Processing failed: {e}")
        raise e

@app.post("/strip-pii")
async def strip_pii_endpoint(file: UploadFile = File(...)):
    """API endpoint to strip PII from uploaded PDF"""
    try:
        # Read file
        pdf_bytes = await file.read()
        
        # Process
        cleaned_text = strip_resume_pii(pdf_bytes)
        
        return {
            "success": True,
            "cleaned_text": cleaned_text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)