import { GoogleGenAI, Type } from "@google/genai";
import { IPOData, IPOStatus, MarketFeedItem } from "../types";

const SYSTEM_INSTRUCTION = `
You are a specialized financial data assistant for the Indian Stock Market.
Your task is to fetch the most recent and active Mainboard and SME IPOs in India.
Focus on extracting:
1. Company Name
2. Registrar (Link Intime, KFintech, Bigshare, Skylinerta, Purva, Maashitla, Cameo, etc.)
3. Current Status (Open, Closed, Allotment Out, Listed)
4. Grey Market Premium (GMP) - Estimated listing gain per share or percentage.
5. Subscription figures (Overall x times).
6. Allotment Date (YYYY-MM-DD format if possible).

Accurate Registrar mapping is CRITICAL for this application.
`;

const mapStatus = (status: string): string => {
  const lower = status.toLowerCase();
  if (lower.includes('allotment') && lower.includes('out')) return IPOStatus.ALLOTMENT_OUT;
  if (lower.includes('list')) return IPOStatus.LISTED;
  if (lower.includes('close')) return IPOStatus.CLOSED;
  if (lower.includes('open')) return IPOStatus.OPEN;
  if (lower.includes('upcom')) return IPOStatus.UPCOMING;
  return status;
}

export const fetchIPODetails = async (apiKey: string): Promise<IPOData[]> => {
  if (!apiKey) return [];
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: 'Find the latest Indian IPOs from the last 2 weeks and upcoming next week. Include current GMP, Subscription status, and Registrar.',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ipos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  registrar: { type: Type.STRING },
                  status: { type: Type.STRING },
                  gmp: { type: Type.STRING },
                  subscription: { type: Type.STRING },
                  allotmentDate: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsed = JSON.parse(jsonText);
    return (parsed.ipos || []).map((item: any, index: number) => ({
      id: `ai-ipo-${index}-${Date.now()}`,
      name: item.name,
      registrar: item.registrar,
      status: mapStatus(item.status),
      gmp: item.gmp || 'N/A',
      subscription: item.subscription || 'N/A',
      allotmentDate: item.allotmentDate,
      source: 'AI'
    }));
  } catch (error) {
    console.error("Gemini IPO Fetch Error:", error);
    throw error;
  }
};

export const fetchMarketNews = async (apiKey: string): Promise<MarketFeedItem[]> => {
  if (!apiKey) return [];
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: 'Perform a Google Search to find and return 5 specific, breaking news headlines from the last 24 hours regarding Indian Mainboard and SME IPOs, listing gains, or SEBI updates. Ensure news is current.',
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  source: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsed = JSON.parse(jsonText);
    const feed: MarketFeedItem[] = (parsed.news || []).map((item: any) => ({
      headline: item.headline,
      source: item.source || 'Market News',
      url: '#',
      timestamp: item.timestamp || 'Just now'
    }));

    // Attempt to map grounding chunks to feed URLs
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
        feed.forEach((item, idx) => {
             const chunk = chunks[idx % chunks.length];
             if (chunk?.web?.uri) {
                 item.url = chunk.web.uri;
                 item.source = chunk.web.title || item.source;
             }
        });
    }

    return feed;

  } catch (error) {
    console.error("Gemini News Fetch Error:", error);
    throw error;
  }
};