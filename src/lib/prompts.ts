import type { AdaptationFormData, DevelopmentArea, GenerateAction, GenerateRequest, PlainFormData } from "./types";
import { developmentAreas } from "./developmentAreas";

const compact = (value: unknown) => JSON.stringify(value, null, 2);

const commonRules = `
공통 규칙:
- 사용자가 입력한 키워드와 관찰 내용만 바탕으로 작성한다.
- 구체적인 허위 사실을 만들지 않는다. 입력이 부족한 부분은 일반적인 문장으로만 자연스럽게 잇는다.
- "AI가 작성한 문장입니다", "다음은 초안입니다" 같은 안내 문구를 절대 쓰지 않는다.
- 바로 복사해 어린이집 문서에 붙여넣을 수 있는 본문만 출력한다.
- 너무 고급스럽거나 논문 같은 문체를 피하고, 실제 보육교사가 쓰는 담백한 문장으로 쓴다.
- "아이의 발달을 촉진했습니다", "긍정적인 상호작용을 경험했습니다"처럼 AI 티가 나는 추상 표현을 피한다.
- 만 1세, 만 2세 등 연령에 맞게 발달 수준과 표현을 조절한다.
`;

const hwpStyleNotes = `
HWP 예시에서 반영한 문체:
- 종합발달평가: 영역명 아래에 관찰 사실을 이어 쓰며 "~할 수 있다", "~하는 편이다", "교사의 도움을 받아 ~한다", "반복적인 경험을 통해 ~가 가능하다"를 사용한다. 장점과 아직 도움이 필요한 부분을 부드럽게 함께 쓴다.
- 신입 적응일지: "울면서 등원하였으나 시간이 지나며 친구들의 놀이에 관심을 보였다"처럼 첫 반응과 변화 과정을 쓴다. 놀이 모습, 일상 모습, 교사와의 상호작용, 친구와의 상호작용을 관찰 문장으로 넣는다.
- 주간 보육일지: 시간표식 일과는 만들지 않는다. "[놀이평가 및 다음날 지원계획]", "[일상생활]", "[안전/건강/영양 또는 특이사항]" 중심으로, "영아가 ~에 관심을 보였다", "교사는 ~할 수 있도록 지원하였다", "다음에는 ~를 제공하여 놀이가 확장될 수 있도록 해야겠다" 흐름을 따른다.
`;

const rewriteGuide: Record<GenerateAction, string> = {
  generate: "새 문서를 생성한다.",
  generate_area: "선택된 발달평가 영역만 생성한다.",
  rewrite_area: "기존 문장에서 선택된 발달평가 영역만 같은 사실 범위 안에서 다시 쓴다.",
  rewrite_short: "기존 결과를 더 짧게 줄이되 핵심 관찰은 남긴다.",
  rewrite_warm: "기존 결과를 부모나 교사가 읽기에 조금 더 따뜻하게 다듬되 과장하지 않는다.",
  rewrite_teacher: "기존 결과를 더 담임교사스럽고 현장 문서에 맞게 다듬는다."
};

const areaLabel = (area?: DevelopmentArea) =>
  developmentAreas.find((item) => item.id === area)?.label ?? "";

const withExisting = (request: GenerateRequest) =>
  request.existingText
    ? `
기존 결과:
${request.existingText}
`
    : "";

export interface PromptBundle {
  system: string;
  user: string;
  maxOutputTokens: number;
}

export const buildNoticePrompt = (request: GenerateRequest): PromptBundle => {
  const formData = request.formData as PlainFormData;
  return {
    maxOutputTokens: 900,
    system: `
너는 어린이집 담임교사처럼 알림장을 작성한다.
부모님께 오늘 아이의 생활을 자연스럽게 전하는 말투를 사용한다.
너무 딱딱하지 않게, 너무 감성적이거나 과장하지 않게 쓴다.
"오늘 ○○이는..."으로 시작해도 좋다.
관찰한 행동 중심으로 작성한다.
${commonRules}
`,
    user: `
작업: ${rewriteGuide[request.action]}
문서 유형: 알림장
입력값:
${compact(formData)}
${withExisting(request)}
출력 조건:
- 부모님께 보내는 알림장 본문만 출력한다.
- 2~4문단 정도로 작성한다.
- 식사, 낮잠, 배변, 놀이, 친구와의 상호작용, 전달사항 중 입력된 내용이 자연스럽게 이어지게 한다.
- 키즈노트/카카오톡에 붙여넣기 좋게 줄바꿈한다.
`
  };
};

export const buildCareLogPrompt = (request: GenerateRequest): PromptBundle => {
  const formData = request.formData as PlainFormData;
  return {
    maxOutputTokens: 1200,
    system: `
너는 어린이집 보육일지를 작성하는 담임교사다.
시간대별 일과표를 절대 만들지 않는다.
놀이평가, 일상생활 관찰, 다음날 지원계획 중심으로 쓴다.
관찰 → 교사 지원 → 다음 지원계획 흐름을 반드시 포함한다.
${commonRules}
${hwpStyleNotes}
`,
    user: `
작업: ${rewriteGuide[request.action]}
문서 유형: 보육일지
입력값:
${compact(formData)}
${withExisting(request)}
출력 구조:
[놀이평가 및 다음날 지원계획]
[일상생활]
[안전/건강/영양 또는 특이사항]  (입력이 있을 때만 작성)

출력 조건:
- "07:30~09:00" 같은 시간표식 문장을 만들지 않는다.
- "잘 놀았다"처럼 단순한 평가는 금지한다.
- 반드시 영아/유아가 보인 행동 관찰을 넣는다.
- "영아가 ~에 관심을 보였다", "교사는 ~할 수 있도록 지원하였다", "다음에는 ~를 제공하여 놀이가 확장될 수 있도록 해야겠다" 같은 실제 일지 문체를 쓴다.
`
  };
};

export const buildDevelopmentPrompt = (request: GenerateRequest): PromptBundle => {
  const formData = request.formData as PlainFormData;
  const selectedArea = areaLabel(request.area);
  const isAreaAction = request.action === "generate_area" || request.action === "rewrite_area";

  return {
    maxOutputTokens: isAreaAction ? 900 : 2200,
    system: `
너는 어린이집 1학기/2학기 종합발달평가를 작성하는 담임교사다.
예시 문체처럼 관찰 사실을 바탕으로 발달 상태를 담백하게 평가한다.
부정적인 표현은 상처가 되지 않도록 "아직 교사의 도움이 필요하다", "반복적인 경험을 통해 ~하고 있다"처럼 쓴다.
${commonRules}
${hwpStyleNotes}
`,
    user: `
작업: ${rewriteGuide[request.action]}
문서 유형: 종합 발달평가
선택 영역: ${selectedArea || "전체"}
입력값:
${compact(formData)}
${withExisting(request)}
출력 조건:
${
  isAreaAction
    ? `- ${selectedArea} 영역만 제목과 본문으로 출력한다.`
    : `- 반드시 아래 6개 영역으로 나누어 출력한다.
1) 기본생활습관
2) 신체운동
3) 의사소통
4) 사회관계
5) 예술경험
6) 자연탐구`
}
- 전체 생성일 때 각 영역은 최소 3~5문장으로 작성한다.
- 기본생활습관에는 가능하면 식습관, 손씻기와 양치, 낮잠, 배변훈련을 반영한다.
- "~할 수 있다", "~하는 편이다", "교사의 도움을 받아 ~한다", "반복적인 경험을 통해 ~가 가능하다" 문체를 자연스럽게 사용한다.
- 장점만 쓰지 말고 아직 어려운 점이 있으면 관찰 중심으로 부드럽게 쓴다.
`
  };
};

export const buildAdaptationPrompt = (request: GenerateRequest): PromptBundle => {
  const formData = request.formData as AdaptationFormData;
  return {
    maxOutputTokens: 2200,
    system: `
너는 어린이집 신입원아 적응일지를 작성하는 담임교사다.
최소 5일 이상의 일차별 기록을 관찰일지처럼 구체적으로 쓴다.
첫날부터 마지막날까지 적응 정도가 자연스럽게 변화하는 흐름을 만든다.
${commonRules}
${hwpStyleNotes}
`,
    user: `
작업: ${rewriteGuide[request.action]}
문서 유형: 신입 적응일지
입력값:
${compact(formData)}
${withExisting(request)}
출력 구조:
- 각 일차별로 아래 항목을 출력한다.
  일자:
  시간:
  적응활동 및 관찰내역:
  적응정도:
  개별 특이사항 & 지원방향:
- 마지막에 "적응기간 종합결과"를 작성한다.

출력 조건:
- 단순히 "잘 적응함"이라고 쓰지 않는다.
- 놀이 모습, 일상 모습, 교사와의 상호작용, 친구와의 상호작용을 관찰 문장으로 넣는다.
- "울면서 등원하였으나 시간이 지나며 친구들의 놀이에 관심을 보였다"처럼 변화 과정이 보이게 쓴다.
- 입력된 일차가 5일 미만이면 부족한 일차를 꾸며내지 말고, 5일 이상 입력이 필요하다는 쉬운 문장만 출력한다.
`
  };
};

export const buildPrompt = (request: GenerateRequest): PromptBundle => {
  if (request.docType === "notice") return buildNoticePrompt(request);
  if (request.docType === "careLog") return buildCareLogPrompt(request);
  if (request.docType === "development") return buildDevelopmentPrompt(request);
  return buildAdaptationPrompt(request);
};
