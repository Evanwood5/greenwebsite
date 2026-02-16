const pdfParse = require('pdf-parse');

export async function stripResumePII(pdfBuffer: Buffer): Promise<string> {
    try {
        // Extract text from PDF
        const data = await pdfParse(pdfBuffer);
        let text = data.text;

        // Apply regex patterns to remove PII

        // Email addresses
        text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');

        // Phone numbers
        text = text.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE REDACTED]');
        text = text.replace(/\(\d{3}\)\s*\d{3}[-.]?\d{4}/g, '[PHONE REDACTED]');

        // City, STATE format
        text = text.replace(/\b[A-Z][a-zA-Z\s]+,\s+[A-Z]{2}\b/g, '[LOCATION REDACTED]');

        // Month DD, YYYY dates
        text = text.replace(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2},?\s*\d{4}\b/gi, '[DATE REDACTED]');

        // Month YYYY dates
        text = text.replace(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{4}\b/gi, '[DATE REDACTED]');

        // Date ranges (2020-2024, 2020-Present, etc.)
        text = text.replace(/\b\d{4}\s*[-–—]\s*(?:\d{4}|Present|present|Current|current)\b/g, '[DATE REDACTED]');

        // Zip codes
        text = text.replace(/\b\d{5}(?:-\d{4})?\b/g, '[ZIP REDACTED]');

        // Street addresses
        text = text.replace(/\b\d+\s+[A-Z][a-zA-Z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Court|Ct)\b/gi, '[ADDRESS REDACTED]');

        // LinkedIn profile paths
        text = text.replace(/\/in\/[a-zA-Z0-9\-]+/g, '[PROFILE REDACTED]');
        text = text.replace(/linkedin\.com\/in\/[a-zA-Z0-9\-]+/gi, '[PROFILE REDACTED]');

        // All-caps city names with comma
        text = text.replace(/\b[A-Z]+(?:\s+[A-Z]+){0,2},/g, '[LOCATION REDACTED],');

        console.log('✅ PII stripped successfully');
        return text;

    } catch (error) {
        console.error('❌ PII stripping failed:', error);
        throw new Error('Failed to process resume');
    }
}