export default async function handler(req, res) {
  const { prompt } = req.body;
  
  // Vercelの設定（Environment Variables）からキーを読み込みます
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return res.status(500).json({ output: "Error: GEMINI_API_KEY is not set in Vercel." });
  }

  try {
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

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const output = data.candidates[0].content.parts[0].text.trim();
      res.status(200).json({ output });
    } else {
      res.status(500).json({ output: "Gemini Error: Could not get a response." });
    }
  } catch (error) {
    res.status(500).json({ output: "Server Error: " + error.message });
  }
}
