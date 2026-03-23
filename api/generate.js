export default async function handler(req, res) {
  const { prompt } = req.body;
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return res.status(500).json({ output: "エラー：Vercelのキーが設定されていません。" });
  }

  try {
    // 修正ポイント：モデル名を最新の "gemini-3-flash-preview" に変更
    const modelName = "gemini-3-flash-preview"; 

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are an eBay SEO expert. Optimize this title for sales (max 80 chars). Output ONLY the optimized title: ${prompt}` }]
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      const output = data.candidates[0].content.parts[0].text.trim();
      res.status(200).json({ output });
    } else {
      // まだエラーが出る場合に備えて、Googleからのメッセージを表示
      res.status(500).json({ output: "Google Response: " + (data.error ? data.error.message : "モデルの応答が空です") });
    }
  } catch (error) {
    res.status(500).json({ output: "システムエラーが発生しました。" });
  }
}
