import Code from "../models/Code.js";
import { nanoid } from "nanoid";
import { GoogleGenAI } from "@google/genai";

export const formatCode = async (req, res) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({
        error: "Files array is required",
      });
    }

    // ✅ create Gemini client AFTER dotenv loads
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const cleanedFiles = [];

    for (const file of files) {
      const prompt = `
You are a senior software engineer and expert code reviewer.

Your task is to CLEAN and FIX the code.

STRICT RULES:
- Fix syntax errors if present
- Remove duplicated code
- Improve structure and readability
- Apply official best practices of the language
- Keep the original behavior unless clearly broken
- Do NOT invent new features
- Do NOT add explanations
- Do NOT include markdown
- Do NOT wrap output in backticks
- Output ONLY runnable code

TASKS:
1. Detect programming language
2. Rewrite the code into clean, professional, error-free form

RETURN ONLY VALID JSON:

{
  "language": "string",
  "formattedCode": "clean corrected code here"
}

Filename:
${file.filename}

Original Code:
${file.code}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const rawText = response.text;

      // remove accidental formatting
      const cleanedText = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanedText);

      cleanedFiles.push({
        filename: file.filename,
        language: parsed.language.toLowerCase(),
        code: file.code,
        formattedCode: parsed.formattedCode,
      });
    }

    const slug = nanoid(8);

    const saved = await Code.create({
      slug,
      files: cleanedFiles,
    });

    res.json({
      slug: saved.slug,
    });
  } catch (error) {
    console.error("AI cleaning error:", error);

    res.status(500).json({
      error: "AI code cleaning failed",
    });
  }
};

export const getCode = async (req, res) => {
  const project = await Code.findOne({
    slug: req.params.slug,
  });

  if (!project) {
    return res.status(404).json({
      error: "Project not found",
    });
  }

  res.json(project);
};
