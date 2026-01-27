
import { GoogleGenAI } from "@google/genai";

// Re-initialize GoogleGenAI inside each function to ensure the correct API key is used right before the call.
export async function generateProductDescription(productName: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Génère une description professionnelle et concise de 20 mots maximum pour un produit ou service nommé: "${productName}". Réponds uniquement avec la description en français.`,
    });
    // Access the text property directly from the response object.
    return response.text?.trim() || "Description non disponible.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Service de description indisponible.";
  }
}

export async function getFinancialAdvice(revenue: number, unpaidCount: number): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `En tant qu'expert comptable virtuel, donne un conseil financier court (1 sentence) pour une entreprise avec un chiffre d'affaires de ${revenue}€ et ${unpaidCount} factures impayées. Sois encourageant et professionnel.`,
    });
    // Access the text property directly from the response object.
    return response.text?.trim() || "Continuez votre excellent travail.";
  } catch (error) {
    return "Gardez un œil sur votre trésorerie.";
  }
}
