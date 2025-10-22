import { invokeLLM } from "./_core/llm";

// Predefined list of local service niches
export const NICHES = [
  "Plumbing",
  "HVAC",
  "Roofing",
  "Electrical",
  "Landscaping",
  "Tree Removal",
  "Pest Control",
  "Locksmith",
  "Garage Door Repair",
  "Appliance Repair",
  "Carpet Cleaning",
  "Window Cleaning",
  "Pool Cleaning",
  "Junk Removal",
  "Moving Services",
  "Painting",
  "Flooring",
  "Kitchen Remodeling",
  "Bathroom Remodeling",
  "Concrete",
  "Fencing",
  "Deck Building",
  "Gutter Cleaning",
  "Pressure Washing",
  "Chimney Sweep",
  "Septic Tank Services",
  "Water Damage Restoration",
  "Mold Remediation",
  "Foundation Repair",
  "Basement Waterproofing",
  "Asphalt Paving",
  "Snow Removal",
  "Lawn Care",
  "Irrigation Systems",
  "Solar Panel Installation",
  "Home Security Systems",
  "Auto Repair",
  "Auto Detailing",
  "Towing Services",
  "Windshield Repair",
  "Dental Services",
  "Orthodontics",
  "Plastic Surgery",
  "Dermatology",
  "Chiropractic",
  "Physical Therapy",
  "Veterinary Services",
  "Pet Grooming",
  "Dog Training",
  "Personal Injury Lawyer",
  "Family Law Attorney",
  "Real Estate Attorney",
  "Criminal Defense Lawyer",
  "DUI Attorney",
  "Bankruptcy Lawyer",
  "Tax Attorney",
  "Estate Planning Attorney",
  "Immigration Lawyer",
  "Accountant",
  "Financial Advisor",
  "Insurance Agent",
  "Mortgage Broker",
  "Real Estate Agent",
  "Property Management",
  "Wedding Photographer",
  "Event Planner",
  "Catering",
  "DJ Services",
  "Florist",
  "Bakery",
  "Personal Trainer",
  "Yoga Studio",
  "Martial Arts",
  "Dance Studio",
  "Tutoring Services",
  "Music Lessons",
  "Daycare",
  "Senior Care",
  "Home Health Care",
  "Massage Therapy",
  "Spa Services",
  "Hair Salon",
  "Barber Shop",
  "Nail Salon",
  "Tattoo Shop",
  "Dry Cleaning",
  "Alterations",
  "Shoe Repair",
  "Watch Repair",
  "Computer Repair",
  "Phone Repair",
  "IT Services",
  "Web Design",
  "SEO Services",
  "Social Media Marketing",
  "Graphic Design",
  "Video Production",
  "Printing Services",
];

interface NicheAnalysisInput {
  niche: string;
  location: string;
}

interface NicheAnalysisResult {
  opportunityScore: number;
  searchVolume: number;
  avgCpc: number; // in cents
  competitionLevel: "Low" | "Medium" | "High";
  keywords: Array<{
    keyword: string;
    searchVolume: number;
    cpc: number; // in cents
    difficulty: number;
  }>;
  competitors: Array<{
    name: string;
    url: string;
    domainAuthority: number;
    estimatedTraffic: number;
  }>;
  domains: string[];
  revenueProjection: number; // monthly in cents
  analysis: string;
}

/**
 * Analyzes a niche/location combination using AI to generate realistic data
 * In a production environment, this would integrate with real SEO APIs
 */
export async function analyzeNiche(
  input: NicheAnalysisInput
): Promise<NicheAnalysisResult> {
  const { niche, location } = input;

  // Use AI to generate realistic niche analysis data
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert SEO analyst specializing in local service businesses and rank and rent opportunities. Generate realistic data for niche analysis based on real-world patterns.`,
      },
      {
        role: "user",
        content: `Analyze the rank and rent opportunity for "${niche}" in "${location}". 
        
Provide a comprehensive analysis including:
1. Opportunity Score (1-100) based on profitability, competition, and market demand
2. Monthly search volume for the primary keyword
3. Average CPC in cents (e.g., 850 for $8.50)
4. Competition level (Low/Medium/High)
5. 20 relevant keywords with search volume, CPC (in cents), and difficulty (1-100)
6. Top 5 competitors with realistic domain names, domain authority (1-100), and estimated monthly traffic
7. 5 available domain name suggestions (realistic .com domains)
8. Monthly revenue projection in cents based on lead value and volume
9. Brief analysis explaining the opportunity

Be realistic - use actual market data patterns. High-value niches like legal and medical should have higher CPCs ($20-100+), while home services might be $5-30. Competition should reflect real market conditions.`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "niche_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            opportunityScore: {
              type: "integer",
              description: "Overall opportunity score from 1-100",
            },
            searchVolume: {
              type: "integer",
              description: "Monthly search volume for primary keyword",
            },
            avgCpc: {
              type: "integer",
              description: "Average cost per click in cents",
            },
            competitionLevel: {
              type: "string",
              enum: ["Low", "Medium", "High"],
              description: "Competition level",
            },
            keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  searchVolume: { type: "integer" },
                  cpc: { type: "integer", description: "CPC in cents" },
                  difficulty: {
                    type: "integer",
                    description: "Keyword difficulty 1-100",
                  },
                },
                required: ["keyword", "searchVolume", "cpc", "difficulty"],
                additionalProperties: false,
              },
            },
            competitors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  domainAuthority: { type: "integer" },
                  estimatedTraffic: { type: "integer" },
                },
                required: ["name", "url", "domainAuthority", "estimatedTraffic"],
                additionalProperties: false,
              },
            },
            domains: {
              type: "array",
              items: { type: "string" },
              description: "Available domain suggestions",
            },
            revenueProjection: {
              type: "integer",
              description: "Monthly revenue projection in cents",
            },
            analysis: {
              type: "string",
              description: "Brief analysis of the opportunity",
            },
          },
          required: [
            "opportunityScore",
            "searchVolume",
            "avgCpc",
            "competitionLevel",
            "keywords",
            "competitors",
            "domains",
            "revenueProjection",
            "analysis",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  if (!content || typeof content !== 'string') {
    throw new Error("No response from AI");
  }

  const result = JSON.parse(content) as NicheAnalysisResult;
  return result;
}

