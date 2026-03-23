export default async function handler(req, res) {
  const { prompt } = req.body;
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return res.status(500).json({ output: "Error: GEMINI_API_KEY is missing." });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Optimize this eBay title: ${prompt}` }] }]
      })
    });

    const data = await response.json();

    // 答えが返ってきた場合
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const output = data.candidates[0].content.parts[0].text.trim();
      res.status(200).json({ output });
    } 
    // エラーが返ってきた場合、その内容をそのまま画面に出す
    else {
      res.status(500).json({ output: "Google says: " + JSON.stringify(data) });
    }
  } catch (error) {
    res.status(500).json({ output: "System Error: " + error.message });
  }
}
