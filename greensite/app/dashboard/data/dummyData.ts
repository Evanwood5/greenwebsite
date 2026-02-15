export type Field = "tech" | "engineering" | "business" | "health";

// Company job count data
export interface CompanyData {
  company: string;
  jobCount: number;
}

// Monthly stats
export interface MonthlyStats {
  totalJobs: number;
  percentChange: number; // positive or negative
  previousMonth: number;
}

// All data for one field
export interface FieldData {
  companiesProducingJobs: CompanyData[];
  topHiringCompanies: CompanyData[];
  monthlyStats: MonthlyStats;
}

// Dummy data for all fields
export const fieldData: Record<Field, FieldData> = {
  tech: {
    companiesProducingJobs: [
      { company: "Rocket Mortgage", jobCount: 145 },
      { company: "General Motors", jobCount: 132 },
      { company: "Ford Motor Company", jobCount: 98 },
      { company: "Quicken Loans", jobCount: 87 },
      { company: "DTE Energy", jobCount: 76 },
      { company: "Blue Cross Blue Shield", jobCount: 54 },
      { company: "Stellantis", jobCount: 43 },
      { company: "Duo Security", jobCount: 38 },
    ],
    topHiringCompanies: [
      { company: "Rocket Mortgage", jobCount: 145 },
      { company: "General Motors", jobCount: 132 },
      { company: "Ford Motor Company", jobCount: 98 },
      { company: "Quicken Loans", jobCount: 87 },
      { company: "DTE Energy", jobCount: 76 },
    ],
    monthlyStats: {
      totalJobs: 3840,
      percentChange: 9,
      previousMonth: 3523,
    },
  },
  
  engineering: {
    companiesProducingJobs: [
      { company: "Ford Motor Company", jobCount: 234 },
      { company: "General Motors", jobCount: 198 },
      { company: "Stellantis", jobCount: 167 },
      { company: "ZF Group", jobCount: 89 },
      { company: "Bosch", jobCount: 76 },
      { company: "Denso", jobCount: 54 },
      { company: "Lear Corporation", jobCount: 45 },
      { company: "Magna International", jobCount: 38 },
    ],
    topHiringCompanies: [
      { company: "Ford Motor Company", jobCount: 234 },
      { company: "General Motors", jobCount: 198 },
      { company: "Stellantis", jobCount: 167 },
      { company: "ZF Group", jobCount: 89 },
      { company: "Bosch", jobCount: 76 },
    ],
    monthlyStats: {
      totalJobs: 2156,
      percentChange: 12,
      previousMonth: 1925,
    },
  },
  
  business: {
    companiesProducingJobs: [
      { company: "Quicken Loans", jobCount: 156 },
      { company: "PwC", jobCount: 134 },
      { company: "Deloitte", jobCount: 112 },
      { company: "EY", jobCount: 98 },
      { company: "KPMG", jobCount: 87 },
      { company: "Fifth Third Bank", jobCount: 76 },
      { company: "Huntington Bank", jobCount: 65 },
      { company: "Accenture", jobCount: 54 },
    ],
    topHiringCompanies: [
      { company: "Quicken Loans", jobCount: 156 },
      { company: "PwC", jobCount: 134 },
      { company: "Deloitte", jobCount: 112 },
      { company: "EY", jobCount: 98 },
      { company: "KPMG", jobCount: 87 },
    ],
    monthlyStats: {
      totalJobs: 1892,
      percentChange: -3,
      previousMonth: 1950,
    },
  },
  
  health: {
    companiesProducingJobs: [
      { company: "Henry Ford Health", jobCount: 289 },
      { company: "Beaumont Health", jobCount: 234 },
      { company: "University of Michigan Health", jobCount: 198 },
      { company: "Spectrum Health", jobCount: 167 },
      { company: "Trinity Health", jobCount: 134 },
      { company: "Ascension Michigan", jobCount: 112 },
      { company: "McLaren Health", jobCount: 98 },
      { company: "Blue Cross Blue Shield", jobCount: 76 },
    ],
    topHiringCompanies: [
      { company: "Henry Ford Health", jobCount: 289 },
      { company: "Beaumont Health", jobCount: 234 },
      { company: "University of Michigan Health", jobCount: 198 },
      { company: "Spectrum Health", jobCount: 167 },
      { company: "Trinity Health", jobCount: 134 },
    ],
    monthlyStats: {
      totalJobs: 4521,
      percentChange: 7,
      previousMonth: 4227,
    },
  },
};