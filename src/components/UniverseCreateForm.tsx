import { useState } from "react";
import { invokeFn } from '@/supabase/functionsClient';
import { getUniverseImageSignedUrl } from '@/services/universeImages';
import { useAuth } from "@/hooks/useAuth";

export default function UniverseCreateForm() {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<{ loading: boolean; error?: string; createdSlug?: string }>({ 
    loading: false 
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Don't allow submission if auth is loading or user is not authenticated
    if (authLoading || !user) return;
    
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

    try {
      const data = await invokeFn("create-universe", payload) as any;
      
      if (!data?.success) { 
        setState({ loading: false, error: "Unknown error" }); 
        return; 
      }

      // success
      setState({ loading: false, createdSlug: data.universe?.slug });
      
      const gradeMatch = String(payload.gradeLevel).match(/\d+/);
      const grade = gradeMatch ? parseInt(gradeMatch[0], 10) : undefined;

      // Trigger image generation (non-blocking)
      if (data.universe?.id) {
        const path = `${data.universe.id}/${grade || 6}/cover.webp`;
        getUniverseImageSignedUrl(path).catch(console.warn);
      }
    } catch (error) {
      setState({ loading: false, error: (error as Error).message });
    }
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