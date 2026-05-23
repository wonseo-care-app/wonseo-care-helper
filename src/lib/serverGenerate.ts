import { buildLocalDraft } from "./localDrafts";
import { buildPrompt } from "./prompts";
import type { GenerateRequest, GenerateResponse } from "./types";

const extractText = (data: any): string => {
  if (typeof data?.output_text === "string") return data.output_text.trim();

  const parts: string[] = [];
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") parts.push(content.text);
      if (typeof content?.output_text === "string") parts.push(content.output_text);
    }
  }
  return parts.join("\n").trim();
};

export const generateDocument = async (request: GenerateRequest): Promise<GenerateResponse> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { text: buildLocalDraft(request), source: "local" };
  }

  const prompt = buildPrompt(request);
  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      instructions: prompt.system,
      input: [
        {
          role: "user",
          content: prompt.user
        }
      ],
      max_output_tokens: prompt.maxOutputTokens
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("OpenAI generation failed", response.status, detail);
    throw new Error("생성에 실패했습니다. 입력 내용을 조금 더 적어주세요.");
  }

  const data = await response.json();
  const text = extractText(data);
  if (!text) throw new Error("생성에 실패했습니다. 입력 내용을 조금 더 적어주세요.");
  return { text, source: "openai" };
};
