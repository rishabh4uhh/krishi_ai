const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname)));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Krishi-AI backend is running",
  });
});

app.post("/api/diagnose", async (req, res) => {
  try {

      const { prompt, selectedImageBase64, selectedImageMimeType, apiKey } =
      req.body;

    const activeApiKey = apiKey || GEMINI_API_KEY;

    if (!activeApiKey) {
      return res.status(500).json({
        error: "Server is missing GEMINI_API_KEY",
      });
    }

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: selectedImageMimeType,
                data: selectedImageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response text received from Gemini API");
    }

    res.json({ diagnosis: JSON.parse(text.trim()) });
  } catch (error) {
    console.error("Diagnosis route error:", error);
    res.status(500).json({
      error: "Failed to analyze the image",
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { contents, systemInstruction, apiKey } = req.body;

    const activeApiKey = apiKey || GEMINI_API_KEY;

    if (!activeApiKey) {
      return res.status(500).json({
        error: "Server is missing GEMINI_API_KEY",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ reply: replyText.trim() });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({
      error: "Failed to get chatbot response",
    });
  }
});

app.post("/api/advisory", async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;

    const activeApiKey = apiKey || GEMINI_API_KEY;

    if (!activeApiKey) {
      return res.status(500).json({
        error: "Server is missing GEMINI_API_KEY",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ advisory: text.trim() });
  } catch (error) {
    console.error("Advisory route error:", error);
    res.status(500).json({
      error: "Failed to generate advisory",
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
