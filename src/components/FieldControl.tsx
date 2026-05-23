"use client";

import type { FieldConfig } from "@/lib/types";

interface FieldControlProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
}

const baseClass =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-[17px] leading-6 text-ink outline-none transition focus:border-leaf focus:ring-4 focus:ring-mint";

export function FieldControl({ field, value, onChange }: FieldControlProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-semibold text-ink">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea
          className={`${baseClass} min-h-[96px] resize-y`}
          rows={field.rows ?? 3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
        />
      ) : field.type === "select" ? (
        <select
          className={baseClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">선택</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={baseClass}
          type={field.type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
        />
      )}
    </label>
  );
}

export const inputClass = baseClass;
