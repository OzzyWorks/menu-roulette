
import { GoogleGenAI, Type } from "@google/genai";
import { extractMenuItemsWithOpenAI } from './openaiService';
import { extractMenuItemsWithTesseract } from './tesseractService';

export const extractMenuItemsFromImage = async (base64Data: string): Promise<string[]> => {
  // Priority 1: Try Gemini API
  const geminiKey = process.env.API_KEY || 
                    process.env.GEMINI_API_KEY || 
                    import.meta.env.VITE_GEMINI_API_KEY ||
                    localStorage.getItem('gemini_api_key') || 
                    '';
  
  const openaiKey = process.env.OPENAI_API_KEY || 
                    import.meta.env.VITE_OPENAI_API_KEY ||
                    localStorage.getItem('openai_api_key') || 
                    '';
  
  console.log('API Keys check:');
  console.log('- Gemini:', geminiKey ? `Found (${geminiKey.length} chars)` : 'Not found');
  console.log('- OpenAI:', openaiKey ? `Found (${openaiKey.length} chars)` : 'Not found');
  
  // Try Gemini first if available
  if (geminiKey) {
    try {
      console.log('🎯 Trying Gemini API...');
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      
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
      console.log('✅ Gemini API 成功!');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error: any) {
      console.error("❌ Gemini API エラー:", error);
      
      // If quota exceeded or rate limit, try OpenAI
      if (error?.message?.includes('quota') || 
          error?.message?.includes('limit') || 
          error?.message?.includes('429') ||
          error?.status === 429) {
        console.log('⚠️ Gemini API 制限に達しました。OpenAI にフォールバック中...');
        
        if (openaiKey) {
          try {
            alert('Gemini API の制限に達しました。OpenAI API に切り替えます。');
            return await extractMenuItemsWithOpenAI(base64Data);
          } catch (openaiError: any) {
            console.error("❌ OpenAI API もエラー:", openaiError);
            
            // If OpenAI also fails, fall back to Tesseract
            if (openaiError?.message?.includes('limit') || openaiError?.message?.includes('429')) {
              console.log('⚠️ OpenAI API も制限に達しました。Tesseract OCR にフォールバック中...');
              alert('OpenAI API も制限に達しました。無料の OCR に切り替えます。');
              return extractMenuItemsWithTesseract(base64Data);
            }
            throw openaiError;
          }
        } else {
          // No OpenAI key, go directly to Tesseract
          console.log('⚠️ OpenAI API キーがありません。Tesseract OCR にフォールバック中...');
          alert('Gemini API の制限に達しました。無料の OCR に切り替えます。');
          return extractMenuItemsWithTesseract(base64Data);
        }
      }
      
      // For other Gemini errors, throw
      if (error?.message?.includes('API key')) {
        throw new Error('Gemini API キーが無効です。正しいキーを設定してください。');
      }
      throw new Error(`Gemini API エラー: ${error?.message || '不明なエラー'}`);
    }
  }
  
  // No Gemini key, try OpenAI
  if (openaiKey) {
    console.log('🎯 Gemini キーなし。OpenAI API を使用中...');
    try {
      return await extractMenuItemsWithOpenAI(base64Data);
    } catch (error: any) {
      console.error("❌ OpenAI API エラー:", error);
      
      // If OpenAI fails, fall back to Tesseract
      if (error?.message?.includes('limit') || error?.message?.includes('429')) {
        console.log('⚠️ OpenAI API 制限に達しました。Tesseract OCR にフォールバック中...');
        alert('OpenAI API の制限に達しました。無料の OCR に切り替えます。');
        return extractMenuItemsWithTesseract(base64Data);
      }
      throw error;
    }
  }
  
  // No API keys at all, use Tesseract
  console.log('🎯 API キーがありません。Tesseract OCR を使用中...');
  return extractMenuItemsWithTesseract(base64Data);
};
