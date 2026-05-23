import {
  BookOpenText,
  CalendarDays,
  ClipboardList,
  FileText,
  type LucideIcon
} from "lucide-react";
import type { DevelopmentArea, DocumentType, FieldConfig } from "./types";
import { developmentAreas } from "./developmentAreas";

export interface DocumentConfig {
  type: DocumentType;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  toneHint: string;
  fields: FieldConfig[];
}

export { developmentAreas };

export const documentConfigs: Record<DocumentType, DocumentConfig> = {
  notice: {
    type: "notice",
    title: "알림장 쓰기",
    shortTitle: "알림장",
    icon: FileText,
    toneHint: "부모님께 보내는 따뜻하고 담백한 문장",
    fields: [
      { name: "childName", label: "아동명", type: "text", placeholder: "예: 정이안" },
      { name: "gender", label: "성별", type: "select", options: ["남아", "여아", "기타"] },
      { name: "age", label: "나이 또는 월령", type: "text", placeholder: "예: 만 1세 / 24개월" },
      { name: "className", label: "반 이름", type: "text", placeholder: "예: 기쁨키움2반" },
      { name: "play", label: "오늘의 놀이", type: "textarea", rows: 3, placeholder: "예: 블록놀이, 바다 동물 모형, 그림책" },
      { name: "meal", label: "식사/간식", type: "textarea", rows: 2, placeholder: "예: 간식 잘 먹음, 밥은 조금 먹음" },
      { name: "nap", label: "낮잠", type: "textarea", rows: 2, placeholder: "예: 짧게 잠, 토닥여주니 잠듦" },
      { name: "toileting", label: "배변/기저귀/화장실", type: "textarea", rows: 2 },
      { name: "mood", label: "기분/컨디션", type: "textarea", rows: 2 },
      { name: "interaction", label: "친구와의 상호작용", type: "textarea", rows: 2 },
      { name: "observation", label: "교사가 관찰한 특징", type: "textarea", rows: 3 },
      { name: "parentNote", label: "부모님께 전달할 말", type: "textarea", rows: 2 },
      { name: "extra", label: "추가 키워드", type: "textarea", rows: 2 }
    ]
  },
  careLog: {
    type: "careLog",
    title: "보육일지 쓰기",
    shortTitle: "보육일지",
    icon: ClipboardList,
    toneHint: "놀이평가, 일상생활, 다음날 지원계획 중심",
    fields: [
      { name: "date", label: "날짜", type: "date" },
      { name: "className", label: "반 이름", type: "text", placeholder: "예: 기쁨키움2반" },
      { name: "ageGroup", label: "연령", type: "text", placeholder: "예: 만 1세" },
      { name: "playTopic", label: "놀이 주제", type: "text", placeholder: "예: 시원한 물놀이를 해요" },
      { name: "playDone", label: "오늘 진행한 놀이", type: "textarea", rows: 3 },
      { name: "childReaction", label: "영아/유아가 보인 반응", type: "textarea", rows: 3 },
      { name: "teacherSupport", label: "교사의 지원", type: "textarea", rows: 3 },
      { name: "dailyLife", label: "일상생활 관찰", type: "textarea", rows: 3 },
      { name: "safetyHealthNutrition", label: "안전/건강/영양 관련 내용", type: "textarea", rows: 3 },
      { name: "nextPlan", label: "다음날 지원계획", type: "textarea", rows: 3 },
      { name: "specialNote", label: "특이사항", type: "textarea", rows: 2 },
      { name: "extra", label: "추가 키워드", type: "textarea", rows: 2 }
    ]
  },
  development: {
    type: "development",
    title: "발달평가 쓰기",
    shortTitle: "발달평가",
    icon: BookOpenText,
    toneHint: "6개 영역으로 나누는 종합 발달평가 문장",
    fields: [
      { name: "childName", label: "아동명", type: "text", placeholder: "예: 박하윤" },
      { name: "birthDate", label: "생년월일", type: "date" },
      { name: "className", label: "반명", type: "text" },
      { name: "age", label: "만 나이", type: "text", placeholder: "예: 만 1세" },
      { name: "term", label: "평가 시기", type: "select", options: ["1학기", "2학기"] },
      { name: "basicKeywords", label: "기본생활습관 키워드", type: "textarea", rows: 4, placeholder: "식습관, 손씻기/양치, 낮잠, 배변훈련" },
      { name: "physicalKeywords", label: "신체운동 키워드", type: "textarea", rows: 3 },
      { name: "communicationKeywords", label: "의사소통 키워드", type: "textarea", rows: 3 },
      { name: "socialKeywords", label: "사회관계 키워드", type: "textarea", rows: 3 },
      { name: "artKeywords", label: "예술경험 키워드", type: "textarea", rows: 3 },
      { name: "natureKeywords", label: "자연탐구 키워드", type: "textarea", rows: 3 }
    ]
  },
  adaptation: {
    type: "adaptation",
    title: "적응일지 쓰기",
    shortTitle: "적응일지",
    icon: CalendarDays,
    toneHint: "1일차부터 변화가 보이는 신입원아 적응 기록",
    fields: []
  }
};
