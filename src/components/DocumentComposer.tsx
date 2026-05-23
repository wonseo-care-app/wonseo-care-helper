"use client";

import { ArrowLeft, Clipboard, Copy, RefreshCw, Save, Sparkles, Wand2 } from "lucide-react";
import { documentConfigs, developmentAreas } from "@/lib/documentConfig";
import type {
  AdaptationDay,
  AdaptationFormData,
  DevelopmentArea,
  DocumentType,
  GenerateAction,
  PlainFormData
} from "@/lib/types";
import { FieldControl, inputClass } from "./FieldControl";

interface DocumentComposerProps {
  docType: DocumentType;
  formData: PlainFormData | AdaptationFormData;
  result: string;
  busy: boolean;
  selectedArea: DevelopmentArea;
  onBack: () => void;
  onPlainChange: (name: string, value: string) => void;
  onAdaptationBaseChange: (name: keyof Omit<AdaptationFormData, "days">, value: string) => void;
  onDayChange: (dayId: string, name: keyof AdaptationDay, value: string) => void;
  onAddDay: () => void;
  onRemoveDay: (dayId: string) => void;
  onGenerate: (action: GenerateAction, area?: DevelopmentArea) => void;
  onResultChange: (value: string) => void;
  onCopy: () => void;
  onSave: () => void;
  onUseSample: () => void;
  onApplyProfile: () => void;
  onAreaChange: (area: DevelopmentArea) => void;
}

const adaptationLabels: Array<{
  key: keyof AdaptationDay;
  label: string;
  rows?: number;
  type?: "text" | "date" | "select" | "textarea";
}> = [
  { key: "dayLabel", label: "일차", type: "text" },
  { key: "date", label: "일자", type: "text" },
  { key: "time", label: "등원/하원 시간", type: "text" },
  { key: "activityKeywords", label: "오늘의 적응활동 키워드", type: "textarea", rows: 2 },
  { key: "separation", label: "울음/분리불안 여부", type: "textarea", rows: 2 },
  { key: "teacherResponse", label: "교사 반응", type: "textarea", rows: 2 },
  { key: "playParticipation", label: "놀이 참여 여부", type: "textarea", rows: 2 },
  { key: "meal", label: "간식/식사 여부", type: "textarea", rows: 2 },
  { key: "peerRelation", label: "친구와의 관계", type: "textarea", rows: 2 },
  { key: "adaptationLevel", label: "적응 정도", type: "select" },
  { key: "specialNote", label: "개별 특이사항", type: "textarea", rows: 2 },
  { key: "supportPlan", label: "지원 방향", type: "textarea", rows: 2 }
];

export function DocumentComposer({
  docType,
  formData,
  result,
  busy,
  selectedArea,
  onBack,
  onPlainChange,
  onAdaptationBaseChange,
  onDayChange,
  onAddDay,
  onRemoveDay,
  onGenerate,
  onResultChange,
  onCopy,
  onSave,
  onUseSample,
  onApplyProfile,
  onAreaChange
}: DocumentComposerProps) {
  const config = documentConfigs[docType];
  const Icon = config.icon;
  const plainForm = formData as PlainFormData;
  const adaptationForm = formData as AdaptationFormData;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-4">
      <div className="mb-4 flex items-center gap-3">
        <button className="icon-button" type="button" onClick={onBack} aria-label="처음으로" title="처음으로">
          <ArrowLeft size={22} aria-hidden />
        </button>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-mint text-leaf">
            <Icon size={24} aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold text-ink">{config.title}</h1>
            <p className="truncate text-sm text-[#65736b]">{config.toneHint}</p>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <button className="btn-secondary" type="button" onClick={onApplyProfile}>
          <Clipboard size={20} aria-hidden />
          아이정보
        </button>
        <button className="btn-secondary" type="button" onClick={onUseSample}>
          <Wand2 size={20} aria-hidden />
          예시 채우기
        </button>
      </div>

      <section className="space-y-4">
        {docType === "adaptation" ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <label>
                <span className="mb-2 block text-[15px] font-semibold text-ink">반명</span>
                <input
                  className={inputClass}
                  value={adaptationForm.className}
                  onChange={(event) => onAdaptationBaseChange("className", event.target.value)}
                />
              </label>
              <label>
                <span className="mb-2 block text-[15px] font-semibold text-ink">아동명</span>
                <input
                  className={inputClass}
                  value={adaptationForm.childName}
                  onChange={(event) => onAdaptationBaseChange("childName", event.target.value)}
                />
              </label>
              <label>
                <span className="mb-2 block text-[15px] font-semibold text-ink">기록자</span>
                <input
                  className={inputClass}
                  value={adaptationForm.teacher}
                  onChange={(event) => onAdaptationBaseChange("teacher", event.target.value)}
                />
              </label>
            </div>

            <div className="space-y-4">
              {adaptationForm.days.map((day, index) => (
                <article key={day.id} className="rounded-lg border border-line bg-white p-4 shadow-soft">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-bold text-ink">{day.dayLabel || `${index + 1}일차`}</h2>
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => onRemoveDay(day.id)}
                      disabled={adaptationForm.days.length <= 5}
                    >
                      삭제
                    </button>
                  </div>
                  <div className="grid gap-3">
                    {adaptationLabels.map((field) => (
                      <label key={field.key}>
                        <span className="mb-2 block text-[15px] font-semibold text-ink">
                          {field.label}
                        </span>
                        {field.type === "select" ? (
                          <select
                            className={inputClass}
                            value={day.adaptationLevel}
                            onChange={(event) =>
                              onDayChange(day.id, field.key, event.target.value)
                            }
                          >
                            <option>양호</option>
                            <option>보통</option>
                            <option>미약</option>
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            className={`${inputClass} min-h-[82px]`}
                            rows={field.rows ?? 2}
                            value={String(day[field.key] ?? "")}
                            onChange={(event) =>
                              onDayChange(day.id, field.key, event.target.value)
                            }
                          />
                        ) : (
                          <input
                            className={inputClass}
                            value={String(day[field.key] ?? "")}
                            onChange={(event) =>
                              onDayChange(day.id, field.key, event.target.value)
                            }
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <button className="btn-secondary w-full" type="button" onClick={onAddDay}>
              + 일차 추가
            </button>
          </>
        ) : (
          config.fields.map((field) => (
            <FieldControl
              key={field.name}
              field={field}
              value={plainForm[field.name] ?? ""}
              onChange={(value) => onPlainChange(field.name, value)}
            />
          ))
        )}
      </section>

      <section className="sticky bottom-0 z-10 -mx-4 mt-6 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur">
        {docType === "development" && (
          <div className="mb-3 grid grid-cols-[1fr_auto] gap-2">
            <select
              className={inputClass}
              value={selectedArea}
              onChange={(event) => onAreaChange(event.target.value as DevelopmentArea)}
              aria-label="발달평가 영역 선택"
            >
              {developmentAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.label}
                </option>
              ))}
            </select>
            <button
              className="btn-secondary px-4"
              type="button"
              onClick={() => onGenerate("generate_area", selectedArea)}
              disabled={busy}
            >
              영역 생성
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            className="btn-primary"
            type="button"
            onClick={() => onGenerate("generate", selectedArea)}
            disabled={busy}
          >
            {busy ? <RefreshCw className="animate-spin" size={20} aria-hidden /> : <Sparkles size={20} aria-hidden />}
            전체 생성
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() =>
              onGenerate(docType === "development" ? "rewrite_area" : "rewrite_teacher", selectedArea)
            }
            disabled={busy || !result}
          >
            <RefreshCw size={20} aria-hidden />
            다시 쓰기
          </button>
        </div>

        {docType === "notice" && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              className="btn-secondary"
              type="button"
              onClick={() => onGenerate("rewrite_short")}
              disabled={busy || !result}
            >
              짧게
            </button>
            <button
              className="btn-secondary"
              type="button"
              onClick={() => onGenerate("rewrite_warm")}
              disabled={busy || !result}
            >
              따뜻하게
            </button>
          </div>
        )}
      </section>

      <section className="mt-6 space-y-3">
        <label>
          <span className="mb-2 block text-lg font-bold text-ink">결과 수정</span>
          <textarea
            className="min-h-[320px] w-full rounded-lg border border-line bg-white px-4 py-4 text-[17px] leading-7 text-ink outline-none focus:border-leaf focus:ring-4 focus:ring-mint"
            value={result}
            onChange={(event) => onResultChange(event.target.value)}
            placeholder="생성된 문장이 여기에 표시됩니다."
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button className="btn-primary" type="button" onClick={onCopy} disabled={!result}>
            <Copy size={20} aria-hidden />
            복사하기
          </button>
          <button className="btn-secondary" type="button" onClick={onSave} disabled={!result}>
            <Save size={20} aria-hidden />
            저장하기
          </button>
        </div>
      </section>
    </main>
  );
}
