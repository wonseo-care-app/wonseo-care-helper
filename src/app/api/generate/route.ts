import { NextResponse } from "next/server";
import { generateDocument } from "@/lib/serverGenerate";
import type { GenerateRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as GenerateRequest;
    const result = await generateDocument(payload);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "생성에 실패했습니다. 입력 내용을 조금 더 적어주세요.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
