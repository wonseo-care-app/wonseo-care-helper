"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, FileClock, UserRound } from "lucide-react";
import { DocumentComposer } from "./DocumentComposer";
import { ProfileManager } from "./ProfileManager";
import { SavedList } from "./SavedList";
import { documentConfigs } from "@/lib/documentConfig";
import { makeAdaptationDay, sampleForms } from "@/lib/sampleData";
import {
  createId,
  loadProfiles,
  loadSavedDocuments,
  saveProfiles,
  saveSavedDocuments
} from "@/lib/storage";
import type {
  AdaptationDay,
  AdaptationFormData,
  ChildProfile,
  DevelopmentArea,
  DocumentType,
  GenerateAction,
  GenerateRequest,
  GenerateResponse,
  PlainFormData,
  SavedDocument
} from "@/lib/types";

const docOrder: DocumentType[] = ["notice", "careLog", "development", "adaptation"];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const isAdaptation = (form: PlainFormData | AdaptationFormData): form is AdaptationFormData =>
  "days" in form;

const applyProfileToForm = (
  docType: DocumentType,
  formData: PlainFormData | AdaptationFormData,
  profile?: ChildProfile
) => {
  if (!profile) return formData;

  if (isAdaptation(formData)) {
    return {
      ...formData,
      childName: profile.childName,
      className: profile.className
    };
  }

  const next = { ...formData };
  if ("childName" in next) next.childName = profile.childName;
  if ("gender" in next) next.gender = profile.gender;
  if ("birthDate" in next) next.birthDate = profile.birthDate;
  if ("className" in next) next.className = profile.className;
  if ("age" in next) next.age = profile.age;
  if (docType === "careLog") {
    next.className = profile.className;
    next.ageGroup = profile.age;
  }
  return next;
};

export function WonseoApp() {
  const [hydrated, setHydrated] = useState(false);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
  const [forms, setForms] = useState<Record<DocumentType, PlainFormData | AdaptationFormData>>(
    () => clone(sampleForms)
  );
  const [activeDoc, setActiveDoc] = useState<DocumentType | null>(null);
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [selectedArea, setSelectedArea] = useState<DevelopmentArea>("basic");

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId),
    [profiles, selectedProfileId]
  );

  useEffect(() => {
    const loadedProfiles = loadProfiles();
    setProfiles(loadedProfiles);
    setSelectedProfileId(loadedProfiles[0]?.id ?? "");
    setSavedDocuments(loadSavedDocuments());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveProfiles(profiles);
  }, [hydrated, profiles]);

  useEffect(() => {
    if (!hydrated) return;
    saveSavedDocuments(savedDocuments);
  }, [hydrated, savedDocuments]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2300);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const setForm = (docType: DocumentType, formData: PlainFormData | AdaptationFormData) => {
    setForms((current) => ({ ...current, [docType]: formData }));
  };

  const openDoc = (docType: DocumentType) => {
    setActiveDoc(docType);
    setResult("");
    setForms((current) => ({
      ...current,
      [docType]: applyProfileToForm(docType, current[docType], selectedProfile)
    }));
    window.scrollTo({ top: 0 });
  };

  const applySelectedProfile = () => {
    if (!activeDoc) return;
    setForm(activeDoc, applyProfileToForm(activeDoc, forms[activeDoc], selectedProfile));
    setToast("아이 정보를 넣었습니다.");
  };

  const useSample = () => {
    if (!activeDoc) return;
    setForm(activeDoc, clone(sampleForms[activeDoc]));
    setResult("");
    setToast("예시 입력값을 넣었습니다.");
  };

  const updatePlainField = (name: string, value: string) => {
    if (!activeDoc) return;
    const form = forms[activeDoc];
    if (isAdaptation(form)) return;
    setForm(activeDoc, { ...form, [name]: value });
  };

  const updateAdaptationBase = (
    name: keyof Omit<AdaptationFormData, "days">,
    value: string
  ) => {
    if (activeDoc !== "adaptation") return;
    const form = forms.adaptation as AdaptationFormData;
    setForm("adaptation", { ...form, [name]: value });
  };

  const updateDay = (dayId: string, name: keyof AdaptationDay, value: string) => {
    const form = forms.adaptation as AdaptationFormData;
    setForm("adaptation", {
      ...form,
      days: form.days.map((day) =>
        day.id === dayId ? ({ ...day, [name]: value } as AdaptationDay) : day
      )
    });
  };

  const addDay = () => {
    const form = forms.adaptation as AdaptationFormData;
    setForm("adaptation", {
      ...form,
      days: [...form.days, makeAdaptationDay(form.days.length + 1)]
    });
  };

  const removeDay = (dayId: string) => {
    const form = forms.adaptation as AdaptationFormData;
    if (form.days.length <= 5) {
      setToast("적응일지는 최소 5일이 필요합니다.");
      return;
    }
    setForm("adaptation", { ...form, days: form.days.filter((day) => day.id !== dayId) });
  };

  const generate = async (action: GenerateAction, area?: DevelopmentArea) => {
    if (!activeDoc) return;
    const formData = forms[activeDoc];
    if (activeDoc === "adaptation" && isAdaptation(formData) && formData.days.length < 5) {
      setToast("적응일지는 5일 이상 입력해 주세요.");
      return;
    }

    setBusy(true);
    try {
      const payload: GenerateRequest = {
        docType: activeDoc,
        action,
        formData,
        existingText: action.startsWith("rewrite") ? result : undefined,
        area: activeDoc === "development" ? area : undefined
      };
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as GenerateResponse & { error?: string };
      if (!response.ok || !data.text) {
        throw new Error(data.error || "생성에 실패했습니다. 입력 내용을 조금 더 적어주세요.");
      }
      setResult(data.text);
      setToast(data.source === "local" ? "API 키 없이 예시 문장으로 만들었습니다." : "생성했습니다.");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "생성에 실패했습니다. 입력 내용을 조금 더 적어주세요.");
    } finally {
      setBusy(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(result);
      } else {
        fallbackCopy(result);
      }
      setToast("복사했습니다.");
    } catch {
      fallbackCopy(result);
      setToast("복사했습니다.");
    }
  };

  const saveResult = () => {
    if (!activeDoc || !result) return;
    const formData = forms[activeDoc];
    const plain = isAdaptation(formData) ? undefined : formData;
    const childName = isAdaptation(formData) ? formData.childName : plain?.childName;
    const titleBase =
      childName || (isAdaptation(formData) ? formData.className : plain?.className) || "작성글";
    const next: SavedDocument = {
      id: createId(),
      docType: activeDoc,
      title: `${documentConfigs[activeDoc].shortTitle} - ${titleBase}`,
      childName,
      createdAt: new Date().toISOString(),
      formData: clone(formData),
      text: result
    };
    setSavedDocuments((current) => [next, ...current].slice(0, 80));
    setToast("저장했습니다.");
  };

  const loadSaved = (document: SavedDocument) => {
    setForms((current) => ({ ...current, [document.docType]: clone(document.formData) }));
    setActiveDoc(document.docType);
    setResult(document.text);
    setShowSaved(false);
    window.scrollTo({ top: 0 });
  };

  const deleteSaved = (id: string) => {
    setSavedDocuments((current) => current.filter((document) => document.id !== id));
    setToast("삭제했습니다.");
  };

  if (activeDoc) {
    return (
      <>
        <DocumentComposer
          docType={activeDoc}
          formData={forms[activeDoc]}
          result={result}
          busy={busy}
          selectedArea={selectedArea}
          onBack={() => setActiveDoc(null)}
          onPlainChange={updatePlainField}
          onAdaptationBaseChange={updateAdaptationBase}
          onDayChange={updateDay}
          onAddDay={addDay}
          onRemoveDay={removeDay}
          onGenerate={generate}
          onResultChange={setResult}
          onCopy={copyResult}
          onSave={saveResult}
          onUseSample={useSample}
          onApplyProfile={applySelectedProfile}
          onAreaChange={setSelectedArea}
        />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  return (
    <main className="min-h-dvh bg-paper pb-20">
      <header className="px-4 pb-4 pt-6">
        <div className="mx-auto w-full max-w-2xl">
          <p className="text-sm font-bold uppercase text-leaf">wonseo #3</p>
          <h1 className="mt-1 text-3xl font-extrabold text-ink">보육문서 초안 만들기</h1>
        </div>
      </header>

      <section className="px-4">
        <div className="mx-auto w-full max-w-2xl rounded-lg border border-line bg-white p-4 shadow-soft">
          <label>
            <span className="mb-2 block text-[15px] font-semibold text-ink">작성할 아이</span>
            <select
              className="w-full rounded-lg border border-line bg-white px-4 py-3 text-[17px] text-ink outline-none focus:border-leaf focus:ring-4 focus:ring-mint"
              value={selectedProfileId}
              onChange={(event) => setSelectedProfileId(event.target.value)}
            >
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.childName || "이름 없음"} / {profile.className || "반 미입력"}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="px-4 py-5">
        <div className="mx-auto grid w-full max-w-2xl gap-3">
          {docOrder.map((docType) => {
            const config = documentConfigs[docType];
            const Icon = config.icon;
            return (
              <button
                key={docType}
                className="home-button"
                type="button"
                onClick={() => openDoc(docType)}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-mint text-leaf">
                  <Icon size={26} aria-hidden />
                </span>
                <span className="text-left">
                  <span className="block text-xl font-extrabold">{config.title}</span>
                  <span className="block text-sm font-medium text-[#65736b]">{config.toneHint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4">
        <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-3">
          <button
            className="btn-secondary"
            type="button"
            onClick={() => setShowProfiles((value) => !value)}
          >
            <UserRound size={20} aria-hidden />
            프로필
            {showProfiles ? <ChevronUp size={18} aria-hidden /> : <ChevronDown size={18} aria-hidden />}
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => setShowSaved((value) => !value)}
          >
            <FileClock size={20} aria-hidden />
            이전 글
            {showSaved ? <ChevronUp size={18} aria-hidden /> : <ChevronDown size={18} aria-hidden />}
          </button>
        </div>
      </section>

      <div className="mt-5 space-y-5">
        {showProfiles && (
          <ProfileManager
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelect={setSelectedProfileId}
            onChange={setProfiles}
          />
        )}
        {showSaved && (
          <SavedList documents={savedDocuments} onLoad={loadSaved} onDelete={deleteSaved} />
        )}
      </div>

      {toast && <Toast message={toast} />}
    </main>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed inset-x-4 bottom-5 z-50 mx-auto max-w-md rounded-lg bg-ink px-4 py-3 text-center text-[15px] font-semibold text-white shadow-soft">
      {message}
    </div>
  );
}

function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
