
import { GoogleGenAI, Type } from "@google/genai";
import { extractMenuItemsWithTesseract } from './tesseractService';

export const extractMenuItemsFromImage = async (base64Data: string): Promise<string[]> => {
  // Try to get API key from multiple sources
  const apiKey = process.env.API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 import.meta.env.VITE_GEMINI_API_KEY ||
                 localStorage.getItem('gemini_api_key') || 
                 '';
  
  console.log('API Key check:', apiKey ? `Found (length: ${apiKey.length})` : 'Not found');
  
  // If no API key, use Tesseract (free OCR)
  if (!apiKey) {
    console.log('No API key found, using Tesseract OCR (free)');
    return extractMenuItemsWithTesseract(base64Data);
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
    
    // If API quota exceeded, fall back to Tesseract
    if (error?.message?.includes('quota') || error?.message?.includes('limit') || error?.message?.includes('429')) {
      console.log('API制限に達しました。無料の Tesseract OCR にフォールバック中...');
      alert('Gemini API の制限に達しました。無料の OCR に切り替えます。');
      return extractMenuItemsWithTesseract(base64Data);
    }
    
    // Provide more specific error messages
    if (error?.message?.includes('API key')) {
      throw new Error('API キーが無効です。正しいキーを設定してください。');
    } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      throw new Error('ネットワークエラー: インターネット接続を確認してください。');
    }
    
    throw new Error(`Gemini API エラー: ${error?.message || '不明なエラー'}`);
  }
};
