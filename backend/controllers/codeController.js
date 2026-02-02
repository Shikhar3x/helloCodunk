import Code from "../models/Code.js";
import { nanoid } from "nanoid";
import { GoogleGenAI } from "@google/genai";

export const formatCode = async (req, res) => {
  try {
    const { files } = req.body;
    if (!Array.isArray(files)) {
      return res.status(400).json({ error: "Files required" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const cleanedFiles = [];

    for (const file of files) {
      const prompt = `
Fix and clean this code.
Return ONLY JSON.

{
  "language": "string",
  "formattedCode": "code"
}

Code:
${file.code}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text.replace(/```/g, "");
      const parsed = JSON.parse(text);

      cleanedFiles.push({
        filename: file.filename,
        language: parsed.language.toLowerCase(),
        code: file.code,
        formattedCode: parsed.formattedCode,
      });
    }

    const slug = nanoid(8);
    await Code.create({ slug, files: cleanedFiles });

    res.json({ slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Formatting failed" });
  }
};

export const getCode = async (req, res) => {
  const project = await Code.findOne({ slug: req.params.slug });
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json(project);
};
