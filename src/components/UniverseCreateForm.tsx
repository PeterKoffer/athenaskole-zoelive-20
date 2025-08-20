import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function UniverseCreateForm() {
  const { user } = useAuth();
  const [state, setState] = useState<{ loading: boolean; error?: string; createdSlug?: string }>({ 
    loading: false 
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ loading: true });

    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      subject: form.get("subject"),
      gradeLevel: form.get("gradeLevel"),
      lang: form.get("lang") || "en",
      visibility: form.get("visibility") || "private",
      description: form.get("description") || "",
    };

    const { data, error } = await supabase.functions.invoke("create-universe", { body: payload });
    if (error) { setState({ loading: false, error: error.message }); return; }
    if (!data?.success) { setState({ loading: false, error: "Unknown error" }); return; }

    // success
    setState({ loading: false, createdSlug: data.universe.slug });
    
    const gradeMatch = String(payload.gradeLevel).match(/\d+/);
    const grade = gradeMatch ? parseInt(gradeMatch[0], 10) : undefined;

    // Trigger image generation (non-blocking)
    supabase.functions.invoke('image-ensure', {
      body: {
        universeId: data.universe.id,
        universeTitle: payload.title,
        subject: payload.subject,
        grade,
        scene: 'cover: main activity'
      }
    }).catch(() => {}); // fire and forget
    
    // navigate to the new universe if you like
    // router.push(`/universes`);
  }

  if (!user) return <p>Please sign in to create universes.</p>;

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px" }}>
      {state.error && <div style={{ color: "crimson" }}>Error: {state.error}</div>}
      
      <label>Title
        <input name="title" required defaultValue="" />
      </label>
      
      <label>Subject
        <select name="subject" required defaultValue="">
          <option value="">Select...</option>
          <option value="science">Science</option>
          <option value="math">Math</option>
          <option value="language-arts">Language Arts</option>
          <option value="social-studies">Social Studies</option>
        </select>
      </label>
      
      <label>Grade Level
        <select name="gradeLevel" required defaultValue="">
          <option>K-2</option><option>3-5</option>
        </select>
      </label>
      
      <label>Language
        <select name="lang" defaultValue="en">
          <option value="en">English</option>
          <option value="da">Danish</option>
        </select>
      </label>
      
      <label>Visibility
        <select name="visibility" defaultValue="private">
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </label>
      
      <label>Description
        <textarea name="description"></textarea>
      </label>
      
      <button disabled={state.loading} type="submit">
        {state.loading ? "Creating..." : "Create Universe"}
      </button>
      
      {state.createdSlug && <div>Created ✓ - slug: {state.createdSlug}</div>}
    </form>
  );
}