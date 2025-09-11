export async function generate(subject: string, context: Context) {
  const payload = { subject, ...normalize(context) };
  const { data, error } = await supabase.functions.invoke("generate-content", { body: payload });
  if (error) throw error;
  return data;
}
