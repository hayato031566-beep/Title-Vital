export default async function handler(req, res) {
  const { prompt } = req.body;
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return res.status(500).json({ output: "Error: GEMINI_API_KEY is missing in Vercel." });
  }

  try {
    // 修正ポイント：URLを v1beta に、モデル名を -latest 付きに変更
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are an eBay SEO expert. Optimize this title for sales. Max 80 characters. Output ONLY the optimized title: ${prompt}` }]
        }]
      })
    });

    const data = await response.json();

    // 成功した場合
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const output = data.candidates[0].content.parts[0].text.trim();
      res.status(200).json({ output });
    } 
    // エラー詳細を表示（解決のヒントになります）
    else {
      res.status(500).json({ output: "Google Response: " + (data.error ? data.error.message : JSON.stringify(data)) });
    }
  } catch (error) {
    res.status(500).json({ output: "System Error: " + error.message });
  }
}
