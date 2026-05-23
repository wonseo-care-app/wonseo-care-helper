import type { AdaptationDay, AdaptationFormData, ChildProfile, PlainFormData } from "./types";

export const sampleProfiles: ChildProfile[] = [
  {
    id: "sample-jung-ian",
    childName: "정이안",
    gender: "남아",
    birthDate: "2022-09-01",
    className: "기쁨키움2반",
    age: "만 1세",
    notes: "친구 놀이를 지켜보다가 천천히 참여하며 낮잠은 짧게 자는 편"
  },
  {
    id: "sample-park-hayun",
    childName: "박하윤",
    gender: "여아",
    birthDate: "2022-06-22",
    className: "기쁨키움2반",
    age: "만 1세",
    notes: "친구에게 먼저 다가가고 노래와 신체표현을 좋아함"
  }
];

export const sampleNotice: PlainFormData = {
  childName: "정이안",
  gender: "남아",
  age: "만 1세",
  className: "기쁨키움2반",
  play: "블록놀이, 친구에게 블록 건네줌, 바다 동물 모형 살펴봄",
  meal: "오전 간식 잘 먹음, 점심은 좋아하는 반찬 위주로 먹음",
  nap: "토닥여주니 잠들었고 평소보다 짧게 잠",
  toileting: "기저귀 갈이 때 매트에 누워 기다림",
  mood: "등원 후 안정적인 편, 놀이 중 표정 밝음",
  interaction: "친구가 쌓는 블록을 지켜보다가 같은 블록을 건네줌",
  observation: "처음에는 지켜보다가 교사가 블록을 함께 쌓아주니 따라 쌓고 무너뜨림",
  parentNote: "가정에서도 충분히 쉬며 컨디션 살펴봐 주세요",
  extra: "낮잠 짧게 잠, 블록 반복 놀이"
};

export const sampleCareLog: PlainFormData = {
  date: new Date().toISOString().slice(0, 10),
  className: "기쁨키움2반",
  ageGroup: "만 1세",
  playTopic: "시원한 물놀이를 해요",
  playDone: "색깔 블록으로 바다 만들기, 바다 생물 모형 올려보기",
  childReaction: "파란 비닐 위에 앉아 블록을 길게 늘어뜨리고 바다 생물 모형을 교사에게 보여줌",
  teacherSupport: "바다 생물 이름을 말해주고 블록 위에 올려보도록 상호작용함",
  dailyLife: "손 씻기 전 놀이를 멈추고 화장실로 이동하도록 격려함",
  safetyHealthNutrition: "젖은 바닥에 미끄러지지 않도록 놀이 공간을 살피고 물기를 정리함",
  nextPlan: "다양한 크기의 블록과 바다 생물 사진을 함께 제공하여 놀이가 이어지도록 지원",
  specialNote: "",
  extra: "놀이평가 중심, 시간표 제외"
};

export const sampleDevelopment: PlainFormData = {
  childName: "박하윤",
  birthDate: "2022-06-22",
  className: "기쁨키움2반",
  age: "만 1세",
  term: "2학기",
  basicKeywords:
    "식습관: 스스로 숟가락과 포크 사용, 좋아하는 반찬 먼저 먹음. 손씻기/양치: 칫솔과 물컵 찾음, 마무리는 교사 도움. 낮잠: 이부자리 찾아 눕고 길게 잠. 배변훈련: 쉬, 응가를 말로 표현함.",
  physicalKeywords: "두 발 점프, 공 던지기, 블록 높이 쌓기, 암벽 오르기 시도",
  communicationKeywords: "이름 부르면 대답, 이거 뭐야 질문, 싫어/좋아 표현, 사물 이름 말하기",
  socialKeywords: "친구에게 먼저 다가감, 손 잡고 같이 놀자고 표현, 놀잇감 건네줌, 차례 기다림은 연습 필요",
  artKeywords: "신나는 음원에 맞춰 율동, 탬버린과 마라카스 흔들기, 좋아하는 노래 반복 요청",
  natureKeywords: "강아지와 새에 관심, 나뭇잎 촉감 탐색, 동물 울음소리 흉내"
};

export const makeAdaptationDay = (index: number): AdaptationDay => ({
  id: `day-${index}-${Date.now()}`,
  dayLabel: `${index}일차`,
  date: "",
  time: "09:30 - 11:00",
  activityKeywords: "",
  separation: "",
  teacherResponse: "",
  playParticipation: "",
  meal: "",
  peerRelation: "",
  adaptationLevel: index < 3 ? "미약" : index === 3 ? "보통" : "양호",
  specialNote: "",
  supportPlan: ""
});

export const sampleAdaptation: AdaptationFormData = {
  className: "기쁨키움2반",
  childName: "정이안",
  teacher: "안경연",
  days: [
    {
      ...makeAdaptationDay(1),
      date: "3/4",
      activityKeywords: "교실 둘러보기, 교사 품에 안기",
      separation: "엄마를 찾으며 울음, 문을 가리킴",
      teacherResponse: "안아주고 토닥이며 안정될 수 있게 도와줌",
      playParticipation: "놀이 참여는 어려웠고 친구 놀이를 잠깐 바라봄",
      meal: "간식은 먹지 않음",
      peerRelation: "친구와의 직접 상호작용은 거의 없음",
      adaptationLevel: "미약",
      specialNote: "첫 등원이라 엄마를 많이 찾음",
      supportPlan: "등원 시간을 짧게 조절하고 안정감을 느낄 수 있도록 반복적으로 안아주기"
    },
    {
      ...makeAdaptationDay(2),
      date: "3/5",
      activityKeywords: "친구 놀이 관찰, 교실 환경 살펴보기",
      separation: "울면서 등원했지만 전날보다 울음 강도 줄어듦",
      teacherResponse: "친구가 놀이하는 자리 가까이에 앉아볼 수 있도록 도움",
      playParticipation: "놀잇감을 만지지는 않았으나 친구 놀이를 유심히 봄",
      meal: "간식은 조금 시도함",
      peerRelation: "친구 옆에 앉는 것은 아직 어려워함",
      adaptationLevel: "미약",
      specialNote: "물병과 겉옷을 찾으며 나가려는 모습",
      supportPlan: "관심 보이는 놀잇감을 가까이에 두고 스스로 선택할 시간을 주기"
    },
    {
      ...makeAdaptationDay(3),
      date: "3/6",
      activityKeywords: "바다 동물 놀잇감, 간식 자리 앉기",
      separation: "울음을 보였으나 조금씩 그치는 시간이 생김",
      teacherResponse: "애착 물건을 가까이 두고 바다 동물 놀잇감을 제공함",
      playParticipation: "교사의 도움을 받아 놀잇감을 잡고 짧게 놀이함",
      meal: "울면서도 간식을 조금 먹음",
      peerRelation: "친구들이 노는 모습을 바라봄",
      adaptationLevel: "보통",
      specialNote: "울다 그치기를 반복함",
      supportPlan: "좋아하는 놀잇감을 중심으로 놀이 참여 시간을 늘리기"
    },
    {
      ...makeAdaptationDay(4),
      date: "3/7",
      activityKeywords: "음원 듣기, 블록 건네주기",
      separation: "엄마를 찾았지만 울음이 짧아짐",
      teacherResponse: "신나는 음원을 틀어주고 율동을 보여줌",
      playParticipation: "음원에 맞춰 몸을 움직이고 블록을 만짐",
      meal: "간식 자리에 앉아 먹음",
      peerRelation: "친구에게 블록 놀잇감을 건네줌",
      adaptationLevel: "양호",
      specialNote: "교실에서 안정된 표정이 늘어남",
      supportPlan: "친구와 같은 놀잇감으로 나란히 놀이할 수 있게 지원"
    },
    {
      ...makeAdaptationDay(5),
      date: "3/8",
      activityKeywords: "블록 쌓기, 간식 스스로 먹기",
      separation: "등원 시 짧게 울었으나 곧 놀이로 전환됨",
      teacherResponse: "블록을 가까이에 제공하고 충분히 기다려줌",
      playParticipation: "블록을 쌓고 무너뜨리며 반복 놀이함",
      meal: "간식 시간에 숟가락을 들고 스스로 먹음",
      peerRelation: "친구가 놀이하는 블록을 바라보다가 같은 블록으로 놀이함",
      adaptationLevel: "양호",
      specialNote: "겉옷과 물병을 찾는 모습이 줄어듦",
      supportPlan: "원 생활 시간을 조금씩 늘리며 안정적인 일과 경험 돕기"
    }
  ]
};

export const sampleForms = {
  notice: sampleNotice,
  careLog: sampleCareLog,
  development: sampleDevelopment,
  adaptation: sampleAdaptation
};
