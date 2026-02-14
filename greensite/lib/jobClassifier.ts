// lib/jobClassifier.ts
// Updated regex lists based on a 1000-job-title sample from Supabase.

const TECH_REGEX =
    /(software|developer|programmer|web\s*dev|full\s*stack|front\s*end|back\s*end|data\s*scientist|data\s*engineer|machine\s*learning|ml\s*engineer|ai\s*(modeling|engineer|developer)?|\bai\b|devops|cloud\s*engineer|sre|qa|quality\s*assurance|automation(\s*engineer)?|ui\/ux|ux|ui|mobile\s*dev|ios|android|react|node\.?js|next\.?js|python|java\b|javascript|typescript|database|sql|api|cyber\s*security|cybersecurity|information\s*security|network(\s*engineer)?|it\s*support|help\s*desk|\bit\b|systems?\s*administrator|sysadmin|platform\s*engineer|site\s*reliability|technical\s*writer|technical\s*writing|digital\s*media|rpa|intelligent\s*automation|automation\s*developer|solutions\s*architect|enterprise\s*architect)/i;

const ENGINEERING_REGEX =
    /(mechanical\s*engineer|electrical\s*engineer|civil\s*engineer|structural\s*engineer|chemical\s*engineer|aerospace|automotive|manufacturing\s*engineer|process\s*engineer|quality\s*engineer|controls\s*engineer|systems\s*engineer|hardware\s*engineer|firmware|industrial\s*engineer|\bengineer\b|engineering\s*technician|\btechnician\b|mechatronics|robotics|hvac|boiler|utility\s*worker|union\s*carpenter|carpenter|welder|pipefitter|millwright|maintenance(\s*(mechanic|technician))?|diesel\s*technician|electrician|lineman|power\s*engineer|substation|transmission\s*line|plant\s*operator|production\s*(operator|supervisor)|quality\s*control\s*technician|cnc|machine\s*operator|tool\s*and\s*die|material\s*handler|o&m|operations\s*technician)/i;

const HEALTH_REGEX =
    /(nurse|rn\b|lpn\b|cna\b|doctor|physician|medical|health\s*care|healthcare|clinical|therapist|pharmacist|pharmacy|patient\s*care|hospital|health\s*services|medical\s*assistant|dental|veterinary|mental\s*health|counselor|nutritionist|radiologic|lab\s*technician|respiratory|emt\b|paramedic|caregiver|home\s*health|outpatient|medical\s*(billing|coder|coding)|claims.*medical|underwriter.*life|life.*underwriter)/i;

const BUSINESS_REGEX =
    /(business|marketing|sales|finance|accounting|accountant|wealth|banking|relationship\s*banker|loan\s*officer|mortgage|client\s*associate|client\s*service|customer\s*experience|customer\s*service|category\s*(mgr|manager)|management|manager|consultant|hr\b|human\s*resources|recruiting|recruiter|operations|project\s*manager|program\s*manager|product\s*manager|product\s*owner|strategy|analyst|coordinator|administrator|admin\b|executive|director|vice\s*president|vp\b|leasing|agent|insurance|claims|underwriter|actuarial|risk\s*management|compliance|audit|treasury|capital\s*planning|procurement|buyer|supply\s*chain|logistics|forecast|communications|instructional\s*designer|corporate|portfolio\s*manager|account\s*manager|business\s*systems\s*analyst)/i;

export function classifyJobCategory(
    jobTitle: string,
    jobDescription: string
): string {
    const text = `${jobTitle} ${jobDescription}`.toLowerCase();

    // Check HEALTH first to catch "medical coding" before TECH catches "coding"
    if (HEALTH_REGEX.test(text)) return 'health';
    if (TECH_REGEX.test(text)) return 'tech';
    if (ENGINEERING_REGEX.test(text)) return 'engineering';
    if (BUSINESS_REGEX.test(text)) return 'business';

    return 'N/A'; // Changed from null to 'N/A'
}

export function classifyExperienceLevel(
    jobTitle: string,
    jobDescription: string,
    jobType: string
): string | null {
    // Only classify full-time jobs
    if (jobType !== 'full-time') return 'N/A'; // Changed from null to 'N/A'

    const text = `${jobTitle} ${jobDescription}`.toLowerCase();

    if (
        /(senior|sr\.|lead|principal|staff|architect|manager|director|vp|vice president|head of|chief|expert|\d+\+?\s*years?|5\s*years|6\s*years|7\s*years|8\s*years|9\s*years|10\s*years|experienced|advanced|\bii\b|\biii\b|\biv\b)/i.test(
            text
        )
    ) {
        return 'advanced';
    }

    return 'moderate';
}