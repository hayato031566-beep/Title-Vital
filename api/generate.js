export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are an eBay SEO expert. Optimize this title for sales (max 80 chars, only output the title): ${prompt}` }]
        }]
      })
    });

    const data = await response.json();
    // Geminiの返答からテキストだけを抜き出す処理
    const output = data.candidates[0].content.parts[0].text.trim();
    res.status(200).json({ output });
  } catch (error) {
    res.status(500).json({ error: "Gemini Error: Check your API Key" });
  }
}
