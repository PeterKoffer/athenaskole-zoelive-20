import { supabase } from "@/lib/supabaseClient";
import type { GenerateArgs, GenerateResult } from "./index";

export async function generate({ subject, context }: GenerateArgs): Promise<GenerateResult> {
  const payload = { subject, ...context, interests: context.interests ?? [] };
  const { data, error } = await supabase.functions.invoke("generate-content", { body: payload });
  if (error) {
    // @ts-ignore
    const info = { message: error.message, status: error.status, context: error.context };
    console.error("[EdgeContentService] non-2xx", info);
    throw new Error(info.message || "Edge function failed");
  }
  return data;
}
