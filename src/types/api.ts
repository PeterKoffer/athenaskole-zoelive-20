export type ImageEnsureReq = {
  bucket: 'universe-images';
  path: string;
  generateIfMissing?: boolean;
};

export type ImageEnsureRes = { ok: true; path: string } | { ok: false; error: string };

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