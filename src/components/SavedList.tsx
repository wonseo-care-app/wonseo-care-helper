"use client";

import { FileClock, Trash2 } from "lucide-react";
import { documentConfigs } from "@/lib/documentConfig";
import type { SavedDocument } from "@/lib/types";

interface SavedListProps {
  documents: SavedDocument[];
  onLoad: (document: SavedDocument) => void;
  onDelete: (id: string) => void;
}

export function SavedList({ documents, onLoad, onDelete }: SavedListProps) {
  return (
    <section className="border-y border-line bg-[#f7fbf8] px-4 py-5">
      <div className="mx-auto w-full max-w-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sun text-[#5f4a10]">
            <FileClock size={22} aria-hidden />
          </div>
          <h2 className="text-lg font-bold text-ink">이전 작성글</h2>
        </div>

        {documents.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-white p-4 text-[15px] text-[#65736b]">
            저장한 글이 아직 없습니다.
          </p>
        ) : (
          <div className="grid gap-3">
            {documents.map((document) => (
              <article key={document.id} className="rounded-lg border border-line bg-white p-4">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-leaf">
                    {documentConfigs[document.docType].shortTitle}
                  </p>
                  <h3 className="text-lg font-bold text-ink">{document.title}</h3>
                  <p className="text-sm text-[#65736b]">
                    {new Date(document.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <button className="btn-primary" type="button" onClick={() => onLoad(document)}>
                    불러오기
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="삭제"
                    title="삭제"
                    onClick={() => onDelete(document.id)}
                  >
                    <Trash2 size={20} aria-hidden />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
