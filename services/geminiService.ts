
import { GoogleGenAI, Type } from "@google/genai";

export const extractMenuItemsFromImage = async (base64Data: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            text: "Extract ONLY the names of food and drink menu items from the image. \n\nSupported image types:\n- Restaurant menu boards\n- Handwritten menus/notes\n- Ticket machines\n- Printed menus\n\nCRITICAL RULES:\n1. Only return item names that are explicitly written in the image.\n2. Support Japanese and English text.\n3. DO NOT hallucinate. If you can't read it clearly, skip it.\n4. DO NOT include prices, descriptions, categories (like 'Main Dish'), or generic food names that aren't actually on the menu.\n5. Handle handwritten characters carefully.\n6. Return the results as a clean JSON array of strings."
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        }
      }
    }
  });

  try {
    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
};
