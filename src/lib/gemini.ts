import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ─── Helper: Call Gemini with retry on 429 ────────────────
async function callGemini(prompt: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });
      return response.text?.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim() || "{}";
    } catch (error: any) {
      const status = error?.status || error?.code;
      const isRateLimit = status === 429 || error?.message?.includes("429");

      if (isRateLimit && attempt < retries) {
        const waitMs = attempt === 1 ? 5000 : attempt === 2 ? 15000 : 30000;
        console.log(`[GEMINI] Rate limited. Waiting ${waitMs / 1000}s... (attempt ${attempt}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }

      throw error;
    }
  }
  throw new Error("Gemini call failed after all retries");
}

// ─── Enhance Project ─────────────────────────────────────
export async function enhanceProject(
  rawInput: string,
  existingSkills: string[] = []
) {
  const contextLine =
    existingSkills.length > 0
      ? `\nThe candidate already has these skills: ${existingSkills.join(", ")}. Focus on extracting NEW skills not already listed.\n`
      : "";

  const prompt = `You are a professional resume writer and technical recruiter. A job seeker described a project they worked on. Your job is to:

1. Rewrite the project description in a professional, structured format (2-3 sentences max).
2. Extract all relevant technical skills used or implied.
3. Write a one-line summary of the project.
4. Suggest 3 matching job roles for someone with this project experience.
${contextLine}
User input: "${rawInput}"

Respond ONLY in valid JSON (no markdown, no code fences):
{
  "enhancedDescription": "...",
  "extractedSkills": ["skill1", "skill2"],
  "projectSummary": "...",
  "suggestedRoles": ["role1", "role2", "role3"]
}`;

  const text = await callGemini(prompt);
  return JSON.parse(text);
}

// ─── Enhance Experience ──────────────────────────────────
export async function enhanceExperience(
  rawInput: string,
  existingSkills: string[] = []
) {
  const contextLine =
    existingSkills.length > 0
      ? `\nThe candidate already has these skills: ${existingSkills.join(", ")}. Focus on extracting NEW skills not already listed.\n`
      : "";

  const prompt = `You are a professional resume writer. A job seeker described their work experience in simple language. Your job is to:

1. Rewrite it in a professional format with bullet points covering key responsibilities and achievements.
2. Extract relevant skills from the experience.
3. Suggest a professional job title that matches this experience.
${contextLine}
User input: "${rawInput}"

Respond ONLY in valid JSON (no markdown, no code fences):
{
  "enhancedDescription": "...",
  "extractedSkills": ["skill1", "skill2"],
  "suggestedTitle": "..."
}`;

  const text = await callGemini(prompt);
  return JSON.parse(text);
}

// ─── Generate Profile Summary ────────────────────────────
export async function generateProfileSummary(
  skills: string[],
  projects: string[],
  experiences: string[],
  existingRoles: string[] = []
) {
  const rolesContext =
    existingRoles.length > 0
      ? `\nPreviously suggested roles: ${existingRoles.join(", ")}. Build on these but also suggest new opportunities.\n`
      : "";

  const prompt = `You are a professional resume writer. Based on the following candidate data, generate:

1. A professional summary paragraph (3-4 sentences, first-person).
2. A list of the top 5 recommended job roles for this candidate.
3. A list of 5 additional skills the candidate should learn to improve their profile.

Skills: ${skills.join(", ")}
Projects: ${projects.join(" | ")}
Experiences: ${experiences.join(" | ")}
${rolesContext}
Respond ONLY in valid JSON (no markdown, no code fences):
{
  "summary": "...",
  "recommendedRoles": ["role1", "role2"],
  "suggestedSkills": ["skill1", "skill2"]
}`;

  const text = await callGemini(prompt);
  return JSON.parse(text);
}
