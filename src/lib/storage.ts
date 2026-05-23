import type { ChildProfile, SavedDocument } from "./types";
import { sampleProfiles } from "./sampleData";

const PROFILE_KEY = "wonseo3.profiles";
const SAVED_KEY = "wonseo3.savedDocuments";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const loadProfiles = (): ChildProfile[] => {
  if (typeof window === "undefined") return sampleProfiles;
  const profiles = safeParse<ChildProfile[]>(localStorage.getItem(PROFILE_KEY), []);
  if (profiles.length > 0) return profiles;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(sampleProfiles));
  return sampleProfiles;
};

export const saveProfiles = (profiles: ChildProfile[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
};

export const loadSavedDocuments = (): SavedDocument[] => {
  if (typeof window === "undefined") return [];
  return safeParse<SavedDocument[]>(localStorage.getItem(SAVED_KEY), []);
};

export const saveSavedDocuments = (documents: SavedDocument[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVED_KEY, JSON.stringify(documents));
};

export const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
