import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Production and Development directory path
const currentDir = process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazily/safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", appName: "कथा चौतारी" });
  });

  // AI Story Generator / Continuation Endpoint
  app.post("/api/ai/generate-story", async (req, res) => {
    try {
      const { prompt, category, mode, originalStory } = req.body;
      const ai = getGenAI();

      let systemInstruction = `You are a legendary Nepali storyteller and author ("नेपाली कथाकार") proficient in writing rich, emotional, atmospheric, and morally meaningful Nepali literature in Devanagari script.
Your task is to respond in fluent, grammatically correct, expressive Nepali language using Devanagari font. Avoid English words unless standard. Write with evocative descriptions of Nepali villages, hills, rivers, culture, and human emotions.`;

      let userPrompt = "";

      if (mode === "continue") {
        userPrompt = `यहाँ एउटा कथाको सुरुवाती भाग दिइएको छ:
"${originalStory}"

कृपया यो कथालाई ५०० देखि ८०० शब्दमा अगाडि बढाउनुहोस्। कथामा नयाँ मोड, रोमाञ्चक घटनाक्रम र सन्देशमूलक अन्त्य समावेश गर्नुहोस्।
कथालाई शीर्षक र परिच्छेद (Paragraphs) सहित मिलाएर प्रस्तुत गर्नुहोस्।`;
      } else if (mode === "moral") {
        userPrompt = `कृपया निम्न कथाको मुख्य सन्देश, नैतिक शिक्षा र जीवन दर्शनलाई छोटो र प्रभावकारी रूपमा नेपालीमा विश्लेषण गर्नुहोस्:
"${originalStory}"

ढाँचा:
- मुख्य सन्देश (Key Message)
- जीवनमा लागू हुने नैतिक पाठ (Moral Lesson)
- पात्रहरूबाट सिक्नुपर्ने कुरा (Character Insights)`;
      } else {
        userPrompt = `विधा (Category): ${category || "लोककथा"}
विषय/प्रम्प्ट: ${prompt || "एउटा दुर्गम हिमाली गाउँको रहस्य र मित्रताको कथा"}

कृपया यो विधा र विषयमा आधारित एउटा मौलिक र सुन्दर नेपाली कथा लेख्नुहोस् (६००-९०० शब्द)।
कथामा:
१. आकर्षक शीर्षक
२. पात्रहरूको परिचय र गाउँ/वातावरणको वर्णन
३. कथाको उतारचढाव (Conflict / Twist)
४. सन्देशमूलक र मार्मिक अन्त्य
५. अन्त्यमा कथाको नैतिक शिक्षा (Moral) separate box मा।`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      res.json({ success: true, text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "कथा सिर्जना गर्दा प्राविधिक त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।",
      });
    }
  });

  // Vite middleware for development vs static serve in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Katha Chautari Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
