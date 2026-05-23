"use client";

import { Plus, Trash2, UserRound } from "lucide-react";
import type { ChildProfile } from "@/lib/types";
import { createId } from "@/lib/storage";
import { inputClass } from "./FieldControl";

interface ProfileManagerProps {
  profiles: ChildProfile[];
  selectedProfileId: string;
  onSelect: (id: string) => void;
  onChange: (profiles: ChildProfile[]) => void;
}

const emptyProfile = (): ChildProfile => ({
  id: createId(),
  childName: "",
  gender: "여아",
  birthDate: "",
  className: "",
  age: "",
  notes: ""
});

export function ProfileManager({
  profiles,
  selectedProfileId,
  onSelect,
  onChange
}: ProfileManagerProps) {
  const selected = profiles.find((profile) => profile.id === selectedProfileId) ?? profiles[0];

  const updateProfile = (key: keyof ChildProfile, value: string) => {
    if (!selected) return;
    onChange(
      profiles.map((profile) =>
        profile.id === selected.id ? { ...profile, [key]: value } : profile
      )
    );
  };

  const addProfile = () => {
    const next = emptyProfile();
    onChange([...profiles, next]);
    onSelect(next.id);
  };

  const deleteProfile = () => {
    if (!selected || profiles.length <= 1) return;
    const nextProfiles = profiles.filter((profile) => profile.id !== selected.id);
    onChange(nextProfiles);
    onSelect(nextProfiles[0]?.id ?? "");
  };

  return (
    <section className="space-y-4 border-y border-line bg-white px-4 py-5">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint text-leaf">
          <UserRound size={22} aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">아이 프로필</h2>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-2xl gap-3">
        <label>
          <span className="mb-2 block text-[15px] font-semibold text-ink">아이 선택</span>
          <select
            className={inputClass}
            value={selected?.id ?? ""}
            onChange={(event) => onSelect(event.target.value)}
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.childName || "이름 없음"} / {profile.className || "반 미입력"}
              </option>
            ))}
          </select>
        </label>

        {selected && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-[15px] font-semibold text-ink">아동명</span>
              <input
                className={inputClass}
                value={selected.childName}
                onChange={(event) => updateProfile("childName", event.target.value)}
              />
            </label>
            <label>
              <span className="mb-2 block text-[15px] font-semibold text-ink">성별</span>
              <select
                className={inputClass}
                value={selected.gender}
                onChange={(event) => updateProfile("gender", event.target.value)}
              >
                <option>여아</option>
                <option>남아</option>
                <option>기타</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-[15px] font-semibold text-ink">생년월일</span>
              <input
                className={inputClass}
                type="date"
                value={selected.birthDate}
                onChange={(event) => updateProfile("birthDate", event.target.value)}
              />
            </label>
            <label>
              <span className="mb-2 block text-[15px] font-semibold text-ink">만 나이</span>
              <input
                className={inputClass}
                value={selected.age}
                onChange={(event) => updateProfile("age", event.target.value)}
                placeholder="예: 만 1세"
              />
            </label>
            <label>
              <span className="mb-2 block text-[15px] font-semibold text-ink">반명</span>
              <input
                className={inputClass}
                value={selected.className}
                onChange={(event) => updateProfile("className", event.target.value)}
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-[15px] font-semibold text-ink">특이사항</span>
              <textarea
                className={`${inputClass} min-h-[88px]`}
                value={selected.notes}
                onChange={(event) => updateProfile("notes", event.target.value)}
              />
            </label>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button className="btn-secondary" type="button" onClick={addProfile}>
            <Plus size={20} aria-hidden />
            새 아이
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={deleteProfile}
            disabled={profiles.length <= 1}
          >
            <Trash2 size={20} aria-hidden />
            삭제
          </button>
        </div>
      </div>
    </section>
  );
}
