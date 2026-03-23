export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 爆速・最安・安全
        messages: [
          { 
            role: "system", 
            content: "You are an eBay SEO expert. Optimize the title for sales. Max 80 chars. Use keywords that buyers search for. No fake info. Output ONLY the title." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.status(200).json({ output: data.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
}
