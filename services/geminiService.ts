
import { GoogleGenAI, Type } from "@google/genai";

export const extractMenuItemsFromImage = async (base64Data: string): Promise<string[]> => {
  // Try to get API key from multiple sources
  const apiKey = process.env.API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 import.meta.env.VITE_GEMINI_API_KEY ||
                 localStorage.getItem('gemini_api_key') || 
                 '';
  
  console.log('API Key check:', apiKey ? `Found (length: ${apiKey.length})` : 'Not found');
  
  if (!apiKey) {
    const userKey = prompt('Gemini API キーを入力してください:\n\nhttps://aistudio.google.com/apikey で取得できます');
    if (userKey) {
      localStorage.setItem('gemini_api_key', userKey.trim());
      return extractMenuItemsFromImage(base64Data);
    }
    throw new Error('Gemini API キーが設定されていません。');
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
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

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    console.error("Gemini API エラー:", error);
    
    // Provide more specific error messages
    if (error?.message?.includes('API key')) {
      throw new Error('API キーが無効です。正しいキーを設定してください。');
    } else if (error?.message?.includes('quota')) {
      throw new Error('API の使用量制限に達しました。');
    } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      throw new Error('ネットワークエラー: インターネット接続を確認してください。');
    }
    
    throw new Error(`Gemini API エラー: ${error?.message || '不明なエラー'}`);
  }
};
