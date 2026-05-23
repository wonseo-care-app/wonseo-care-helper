import type {
  AdaptationFormData,
  DevelopmentArea,
  GenerateRequest,
  PlainFormData
} from "./types";
import { developmentAreas } from "./developmentAreas";

const value = (form: PlainFormData, key: string, fallback = "") => form[key]?.trim() || fallback;

const childLabel = (name?: string) => {
  const clean = (name || "아이").replace(/\s/g, "");
  return clean.length > 3 ? clean.slice(-2) : clean;
};

const keep = (text?: string, fallback = "입력한 내용을 바탕으로 차분히 관찰되었다.") =>
  text?.trim() || fallback;

const maybeSection = (title: string, text?: string) => (text?.trim() ? `[${title}]\n${text.trim()}` : "");

const finish = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?。요다함음임됨됨니다]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

export const buildNoticeDraft = (form: PlainFormData) => {
  const name = childLabel(value(form, "childName"));
  const play = keep(value(form, "play"), "교실에서 관심 있는 놀잇감을 살펴보며 놀이했습니다.");
  const interaction = value(form, "interaction");
  const observation = value(form, "observation");
  const meal = value(form, "meal");
  const nap = value(form, "nap");
  const toileting = value(form, "toileting");
  const mood = value(form, "mood");
  const parentNote = value(form, "parentNote");
  const extra = value(form, "extra");

  const lines = [
    finish(`오늘 ${name}이는 ${play} 등 놀이에 관심을 보였습니다`),
    interaction ? finish(`친구와의 상호작용에서는 ${interaction} 등의 모습이 보였습니다`) : "",
    observation ? finish(`놀이 중에는 ${observation}`) : "",
    [meal && finish(`식사와 간식은 ${meal}`), nap && finish(`낮잠은 ${nap}`), toileting && finish(`배변/기저귀는 ${toileting}`)]
      .filter(Boolean)
      .join(" "),
    [mood && finish(`오늘 컨디션은 ${mood}`), extra && finish(extra), parentNote && finish(parentNote)].filter(Boolean).join(" ")
  ].filter(Boolean);

  return lines.join("\n\n");
};

export const buildCareLogDraft = (form: PlainFormData) => {
  const playDone = keep(value(form, "playDone"), "영아가 준비된 놀이자료에 관심을 보였다.");
  const reaction = keep(value(form, "childReaction"), "자료를 살펴보고 만져보며 놀이에 참여하였다.");
  const support = keep(value(form, "teacherSupport"), "교사는 영아의 표현에 반응하며 놀이가 이어질 수 있도록 지원하였다.");
  const next = keep(value(form, "nextPlan"), "다음에는 관련 자료를 추가로 제공하여 놀이가 확장될 수 있도록 해야겠다.");
  const daily = value(form, "dailyLife");
  const safety = value(form, "safetyHealthNutrition");
  const special = value(form, "specialNote");

  return [
    `[놀이평가 및 다음날 지원계획]\n${finish(playDone)} ${finish(reaction)} ${finish(support)} ${finish(`다음에는 ${next}`)}`,
    `[일상생활]\n${finish(daily || "일상생활 중 영아의 컨디션과 기본생활 흐름을 살피며 필요한 도움을 제공하였다.")}`,
    maybeSection("안전/건강/영양 또는 특이사항", [safety && finish(safety), special && finish(special)].filter(Boolean).join(" "))
  ]
    .filter(Boolean)
    .join("\n\n");
};

const developmentText: Record<DevelopmentArea, (form: PlainFormData) => string> = {
  basic: (form) =>
    `1) 기본생활습관\n${keep(value(form, "basicKeywords"), "기본생활습관과 관련한 일과를 교사의 도움을 받아 경험하고 있다.")} 식사, 손씻기와 양치, 낮잠, 배변과 관련한 일과를 반복적으로 경험하며 익숙해지고 있다. 스스로 할 수 있는 부분은 시도하려는 모습이 보이며, 아직 도움이 필요한 부분은 교사의 안내를 받아 안정적으로 참여한다. 반복적인 경험을 통해 자신의 물건과 일과 순서를 조금씩 알아가고 있다.`,
  physical: (form) =>
    `2) 신체운동\n${keep(value(form, "physicalKeywords"), "대근육과 소근육을 사용한 놀이에 관심을 보인다.")} 몸을 움직이는 놀이에 참여하며 팔과 다리를 자유롭게 움직일 수 있다. 조작이 필요한 활동은 시간이 걸리기도 하나 교사의 격려를 받으며 시도한다. 반복적인 놀이를 통해 신체 조절 경험이 늘어나고 있다.`,
  communication: (form) =>
    `3) 의사소통\n${keep(value(form, "communicationKeywords"), "교사의 말을 듣고 간단한 표현으로 반응한다.")} 익숙한 말이나 이름을 들으면 시선을 맞추고 반응할 수 있다. 필요한 것을 말이나 몸짓으로 표현하려는 모습이 보인다. 교사의 반복적인 언어적 상호작용을 통해 표현이 조금씩 확장되고 있다.`,
  social: (form) =>
    `4) 사회관계\n${keep(value(form, "socialKeywords"), "친구의 놀이를 바라보며 관심을 보인다.")} 친구와 같은 놀잇감을 사용하거나 가까이에서 놀이하는 경험이 늘고 있다. 원하는 것이 있을 때는 교사의 도움을 받아 표현하며 기다리는 연습이 필요하다. 안정적인 관계 속에서 또래와의 상호작용이 자연스럽게 이어지고 있다.`,
  art: (form) =>
    `5) 예술경험\n${keep(value(form, "artKeywords"), "음악과 미술 자료에 관심을 보인다.")} 익숙한 노래나 리듬에 맞추어 몸을 움직이며 즐거움을 표현한다. 그리기 도구나 악기를 사용해 소리와 색을 탐색할 수 있다. 반복되는 예술 경험을 통해 자신만의 방식으로 표현하려는 모습이 나타난다.`,
  nature: (form) =>
    `6) 자연탐구\n${keep(value(form, "natureKeywords"), "주변 자연물과 사물에 관심을 보인다.")} 관심 있는 대상은 손으로 만져보거나 바라보며 탐색한다. 동물, 식물, 생활 속 사물의 이름과 특징을 교사와 함께 알아간다. 반복적인 탐색 경험을 통해 주변 세계에 대한 호기심이 이어지고 있다.`
};

export const buildDevelopmentDraft = (request: GenerateRequest) => {
  const form = request.formData as PlainFormData;
  if (request.area) return developmentText[request.area](form);
  return developmentAreas.map((area) => developmentText[area.id](form)).join("\n\n");
};

export const buildAdaptationDraft = (form: AdaptationFormData) => {
  if (!form.days || form.days.length < 5) {
    return "신입 적응일지는 최소 5일 이상 입력한 뒤 생성해 주세요.";
  }

  const name = childLabel(form.childName);
  const days = form.days.map((day) => {
    const observation = [
      day.separation && `${day.separation}`,
      day.teacherResponse && `교사는 ${day.teacherResponse}`,
      day.activityKeywords && `${day.activityKeywords} 활동을 경험하였다.`,
      day.playParticipation && `놀이에서는 ${day.playParticipation}`,
      day.meal && `일상생활에서는 ${day.meal}`,
      day.peerRelation && `친구와는 ${day.peerRelation}`
    ]
      .filter(Boolean)
      .join(" ");

    return `${day.dayLabel}\n일자: ${day.date || "-"}\n시간: ${day.time || "-"}\n적응활동 및 관찰내역: ${observation || `${name}이가 교실 환경을 살피며 적응 과정을 경험하였다.`}\n적응정도: ${day.adaptationLevel}\n개별 특이사항 & 지원방향: ${[day.specialNote, day.supportPlan].filter(Boolean).join(" ") || "안정적으로 일과를 경험할 수 있도록 교사가 가까이에서 지원해야겠다."}`;
  });

  return `${days.join("\n\n")}\n\n적응기간 종합결과\n${name}이는 등원 초기 낯선 환경에서 울음이나 보호자를 찾는 모습을 보였으나, 시간이 지나며 교사의 도움을 받아 교실과 놀잇감에 관심을 보이기 시작하였다. 친구들의 놀이를 지켜보는 시간이 늘었고, 관심 있는 놀잇감을 중심으로 짧게 놀이에 참여하는 모습이 나타났다. 앞으로도 안정감을 느낄 수 있도록 일과 시간을 조금씩 늘리고, 좋아하는 놀이를 중심으로 또래와 함께 경험할 수 있도록 지원해야겠다.`;
};

export const buildLocalDraft = (request: GenerateRequest) => {
  if (request.docType === "notice") return buildNoticeDraft(request.formData as PlainFormData);
  if (request.docType === "careLog") return buildCareLogDraft(request.formData as PlainFormData);
  if (request.docType === "development") return buildDevelopmentDraft(request);
  return buildAdaptationDraft(request.formData as AdaptationFormData);
};
