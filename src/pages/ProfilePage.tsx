
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveEduContext } from "@/services/edu/locale";

interface ProfileData {
  full_name?: string | null;
  country_code?: string | null;
  locale?: string | null;
  currency_code?: string | null;
  measurement_system?: string | null;
  curriculum_code?: string | null;
  timezone?: string | null;
}

const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "DK", label: "Denmark" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "ES", label: "Spain" },
  { code: "SE", label: "Sweden" },
  { code: "NO", label: "Norway" },
  { code: "FI", label: "Finland" },
  { code: "NL", label: "Netherlands" },
];

export default function ProfilePage() {
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    full_name: "",
    country_code: "US",
    locale: "",
    currency_code: "",
    measurement_system: "imperial",
    curriculum_code: "",
    timezone: "",
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      const profile: ProfileData = data ?? {};
      const ctx = resolveEduContext({
        countryCode: profile.country_code || undefined,
        locale: profile.locale || undefined,
        currencyCode: profile.currency_code || undefined,
        measurement: profile.measurement_system as any || undefined,
        curriculumCode: profile.curriculum_code || undefined,
        timezone: profile.timezone || undefined,
      });
      setForm({
        full_name: profile.full_name ?? "",
        country_code: ctx.countryCode,
        locale: ctx.locale,
        currency_code: ctx.currencyCode,
        measurement_system: ctx.measurement,
        curriculum_code: ctx.curriculumCode,
        timezone: ctx.timezone ?? "",
      });
      setLoading(false);
    })();
  }, []);

  function onCountryChange(code: string) {
    const ctx = resolveEduContext({ countryCode: code });
    setForm(f => ({
      ...f,
      country_code: code,
      locale: ctx.locale,
      currency_code: ctx.currencyCode,
      measurement_system: ctx.measurement,
      curriculum_code: ctx.curriculumCode,
      timezone: f.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    }));
  }

  async function save() {
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      country_code: form.country_code,
      locale: form.locale,
      currency_code: form.currency_code,
      measurement_system: form.measurement_system,
      curriculum_code: form.curriculum_code,
      timezone: form.timezone,
    }).eq("user_id", userId);
    setLoading(false);
    if (error) alert(error.message); else alert("Saved!");
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm">
          Full name
          <input className="mt-1 w-full border rounded px-2 py-1"
                 value={form.full_name}
                 onChange={e=>setForm({...form, full_name: e.target.value})}/>
        </label>

        <label className="text-sm">
          Country
          <select className="mt-1 w-full border rounded px-2 py-1"
                  value={form.country_code}
                  onChange={e=>onCountryChange(e.target.value)}>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </label>

        <label className="text-sm">
          Locale (auto, editable)
          <input className="mt-1 w-full border rounded px-2 py-1"
                 value={form.locale}
                 onChange={e=>setForm({...form, locale: e.target.value})}/>
        </label>

        <label className="text-sm">
          Currency (auto, editable)
          <input className="mt-1 w-full border rounded px-2 py-1"
                 value={form.currency_code}
                 onChange={e=>setForm({...form, currency_code: e.target.value.toUpperCase()})}/>
        </label>

        <label className="text-sm">
          Measurement system
          <select className="mt-1 w-full border rounded px-2 py-1"
                  value={form.measurement_system}
                  onChange={e=>setForm({...form, measurement_system: e.target.value as any})}>
            <option value="metric">Metric (meters, kg, °C)</option>
            <option value="imperial">Imperial (feet, lb, °F)</option>
          </select>
        </label>

        <label className="text-sm">
          Curriculum (auto, editable)
          <input className="mt-1 w-full border rounded px-2 py-1"
                 placeholder="US-CCSS / DK-COMMON …"
                 value={form.curriculum_code}
                 onChange={e=>setForm({...form, curriculum_code: e.target.value})}/>
        </label>

        <label className="text-sm md:col-span-2">
          Timezone
          <input className="mt-1 w-full border rounded px-2 py-1"
                 value={form.timezone}
                 onChange={e=>setForm({...form, timezone: e.target.value})}/>
        </label>
      </div>

      <div className="flex gap-2">
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={save}>Save</button>
      </div>
    </div>
  );
}
