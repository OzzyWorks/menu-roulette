
import Tesseract from 'tesseract.js';

export const extractMenuItemsWithTesseract = async (imageData: string): Promise<string[]> => {
  try {
    // Convert base64 to blob URL for Tesseract
    const base64Data = imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`;
    
    console.log('Starting OCR with Tesseract.js...');
    
    const result = await Tesseract.recognize(
      base64Data,
      'jpn+eng', // Japanese and English
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );
    
    console.log('OCR完了:', result.data.text);
    
    // Extract menu items from recognized text
    const text = result.data.text;
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Filter out prices and numbers, keep only likely menu items
    const menuItems = lines.filter(line => {
      // Skip lines that are just numbers or prices
      if (/^[\d,¥$\s]+$/.test(line)) return false;
      // Skip very short lines (likely noise)
      if (line.length < 2) return false;
      // Skip lines with only symbols
      if (/^[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/.test(line)) return false;
      return true;
    });
    
    // Remove duplicates
    const uniqueItems = [...new Set(menuItems)];
    
    console.log('抽出されたメニュー:', uniqueItems);
    
    return uniqueItems;
  } catch (error) {
    console.error('Tesseract OCR エラー:', error);
    throw new Error('画像からテキストを読み取れませんでした。');
  }
};
