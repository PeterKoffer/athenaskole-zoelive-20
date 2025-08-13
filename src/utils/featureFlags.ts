export const FF_DK_TARGETS =
  String((import.meta as any).env?.VITE_FEATURE_DK_TARGETS || "").toLowerCase() === "true";
