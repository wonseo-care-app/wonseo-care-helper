import type { Handler } from "@netlify/functions";
import { generateDocument } from "../../src/lib/serverGenerate";
import type { GenerateRequest } from "../../src/lib/types";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8"
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "POST 요청만 사용할 수 있습니다." })
    };
  }

  let request: GenerateRequest;
  try {
    request = JSON.parse(event.body || "{}") as GenerateRequest;
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "입력 내용을 확인해 주세요." })
    };
  }

  try {
    const result = await generateDocument(request);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "생성에 실패했습니다. 입력 내용을 조금 더 적어주세요." })
    };
  }
};
