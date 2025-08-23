export type ImageEnsureReq = {
  bucket: 'universe-images';
  path: string;
  generateIfMissing?: boolean;
};

export type ImageEnsureOk = { ok: true; path: string; exists: boolean; size?: number; created?: boolean };
export type ImageEnsureErr = { ok: false; error?: string; status?: number };
export type ImageEnsureRes = ImageEnsureOk | ImageEnsureErr;

export type AdaptiveContentRes = {
  success?: boolean;
  generatedContent?: any;
  content?: any;
  activities?: any[];
  question?: string;
  options?: string[];
  correct?: number;
  explanation?: string;
  atoms?: any[];
  meta?: Record<string, any>;
  error?: string;
};