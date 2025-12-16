import { GoogleGenAI, Type, Schema, Part } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema definition for the complex object we expect back
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cleanedTranscript: {
      type: Type.STRING,
      description: "The transcript with filler words removed, grammar corrected, and formatted into paragraphs. If video input is provided, transcribe the main speech.",
    },
    highlights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING, description: "Start and end time, e.g., '00:15 - 00:45'" },
          snippet: { type: Type.STRING, description: "The text content of the highlight" },
          reason: { type: Type.STRING, description: "Why this was selected (emotional hook, quote, etc.)" },
          title: { type: Type.STRING, description: "A catchy, viral title for this short clip (max 50 chars)" },
          visualPrompt: { type: Type.STRING, description: "A creative, detailed prompt for an AI image generator (like Midjourney) to create a high-quality thumbnail/cover for this specific clip." },
        },
        required: ["timestamp", "snippet", "reason", "title", "visualPrompt"],
      },
    },
    seo: {
      type: Type.OBJECT,
      properties: {
        youtubeShorts: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        tikTok: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        instagramReels: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        facebook: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
      required: ["youtubeShorts", "tikTok", "instagramReels", "facebook"],
    },
    captions: {
      type: Type.STRING,
      description: "The full SRT format content string for the highlights.",
    },
    ffmpegCommands: {
      type: Type.STRING,
      description: "The raw FFmpeg command lines to cut, resize, and subtitle the clips.",
    },
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Day of the week (Day 1 - Day 7)" },
          platform: { type: Type.STRING },
          time: { type: Type.STRING, description: "Best local posting time" },
          contentTitle: { type: Type.STRING },
        },
      },
    },
    analyticsReport: {
      type: Type.OBJECT,
      properties: {
        topClip: { type: Type.STRING },
        bestHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
  },
  required: ["cleanedTranscript", "highlights", "seo", "captions", "ffmpegCommands", "schedule", "analyticsReport"],
};

export const analyzeTranscript = async (content: string, mimeType: string, engagementStats: string): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash"; // Efficient for text processing and multimodal

  let promptParts: Part[] = [];
  
  const systemInstruction = `
    You are an expert video content strategist.
    Process the provided video content (or transcript) and engagement context.

    Perform these tasks:
    1. If the input is a video, generate a clean transcript. If it's text, clean it (remove filler words, fix grammar).
    2. Identify 3 engaging highlights (under 30s) suitable for Shorts/Reels. For each highlight, provide a viral title and a detailed visual prompt for an AI thumbnail generator.
    3. Generate SEO metadata for Shorts, TikTok, Reels, FB.
    4. Create SRT captions for the highlights (max 6 words per line).
    5. Generate FFmpeg commands to cut 'input.mp4', crop to 9:16, and overlay captions.
    6. Create a 7-day posting schedule.
    7. Generate a brief analytics report based on the provided engagement context (or simulate a projection if context is generic).

    Return ONLY the structured JSON matching the schema.
  `;

  // Build content parts
  if (mimeType.startsWith("video/")) {
    promptParts.push({
      inlineData: {
        data: content, // base64 string
        mimeType: mimeType,
      }
    });
    promptParts.push({ text: "Analyze this video." });
  } else {
    // Treat as text (transcript or URL)
    promptParts.push({ text: `Raw Transcript or Content URL: """${content}"""` });
  }

  promptParts.push({ text: `Engagement Context: """${engagementStats}"""` });

  try {
    const result = await ai.models.generateContent({
      model,
      contents: { parts: promptParts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = result.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};