export type DocumentType = "notice" | "careLog" | "development" | "adaptation";

export type GenerateAction =
  | "generate"
  | "rewrite_short"
  | "rewrite_warm"
  | "rewrite_teacher"
  | "generate_area"
  | "rewrite_area";

export type FieldType = "text" | "textarea" | "date" | "select";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  rows?: number;
}

export interface ChildProfile {
  id: string;
  childName: string;
  gender: string;
  birthDate: string;
  className: string;
  age: string;
  notes: string;
}

export interface AdaptationDay {
  id: string;
  dayLabel: string;
  date: string;
  time: string;
  activityKeywords: string;
  separation: string;
  teacherResponse: string;
  playParticipation: string;
  meal: string;
  peerRelation: string;
  adaptationLevel: "양호" | "보통" | "미약";
  specialNote: string;
  supportPlan: string;
}

export interface AdaptationFormData {
  className: string;
  childName: string;
  teacher: string;
  days: AdaptationDay[];
}

export type PlainFormData = Record<string, string>;

export interface GenerateRequest {
  docType: DocumentType;
  action: GenerateAction;
  formData: PlainFormData | AdaptationFormData;
  existingText?: string;
  area?: DevelopmentArea;
}

export interface GenerateResponse {
  text: string;
  source?: "openai" | "local";
}

export type DevelopmentArea =
  | "basic"
  | "physical"
  | "communication"
  | "social"
  | "art"
  | "nature";

export interface SavedDocument {
  id: string;
  docType: DocumentType;
  title: string;
  childName?: string;
  createdAt: string;
  formData: PlainFormData | AdaptationFormData;
  text: string;
}
