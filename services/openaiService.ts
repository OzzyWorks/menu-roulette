
export const extractMenuItemsWithOpenAI = async (base64Data: string): Promise<string[]> => {
  const apiKey = process.env.OPENAI_API_KEY || 
                 import.meta.env.VITE_OPENAI_API_KEY ||
                 localStorage.getItem('openai_api_key') || 
                 '';
  
  if (!apiKey) {
    throw new Error('OpenAI API キーが設定されていません。');
  }

  try {
    console.log('OpenAI API で画像解析中...');
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found');
    
    // Use fetch API directly instead of OpenAI SDK (browser compatibility)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `この画像からメニュー項目の名前だけを抽出してください。

ルール:
1. 料理名・飲み物名のみを抽出
2. 価格、説明文、カテゴリ名は除外
3. 手書き文字も認識する
4. 日本語と英語の両方に対応
5. JSON配列形式で返す: ["アイテム1", "アイテム2"]

画像に書かれているメニュー項目のみを返してください。`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    console.log('OpenAI Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Error Response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }
      
      throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    console.log('OpenAI レスポンス:', content);
    
    // Extract JSON array from response
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    // If no JSON found, try to parse as lines
    const lines = content.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('-') && !line.startsWith('*'))
      .map(line => line.replace(/^["']|["']$/g, '').replace(/^\d+\.\s*/, ''));
    
    return lines;
  } catch (error: any) {
    console.error("OpenAI API 詳細エラー:", error);
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
    
    // Check if it's a network/CORS error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('OpenAI API への接続に失敗しました。CORS エラーの可能性があります。');
    }
    
    if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
      throw new Error('OpenAI API キーが無効です。');
    } else if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      throw new Error('OpenAI API の使用量制限に達しました。');
    } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
      throw new Error('ネットワークエラー: OpenAI API に接続できません。CORS の問題の可能性があります。');
    }
    
    throw new Error(`OpenAI API エラー: ${error?.message || '不明なエラー'}`);
  }
};
