export default async function handler(req, res) {
  const { prompt } = req.body;
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return res.status(500).json({ output: "Error: No GEMINI_API_KEY found in Vercel." });
  }

  try {
    // Gemini 1.5 Flash（爆速・無料枠あり）を呼び出す設定
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are an eBay SEO expert. Optimize this title for sales. Max 80 characters. Output ONLY the optimized title: ${prompt}` }]
        }]
      })
    });

    const data = await response.json();

    // AIの返答をチェックして、テキストだけを抜き出す
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const output = data.candidates[0].content.parts[0].text.trim();
      res.status(200).json({ output });
    } else {
      res.status(500).json({ output: "Gemini error: AI did not respond correctly." });
    }
  } catch (error) {
    res.status(500).json({ output: "Network Error: Could not connect to Gemini." });
  }
}
