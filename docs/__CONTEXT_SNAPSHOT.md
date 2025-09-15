# Repo Context Snapshot

_Generated: 2025-09-15 09:27:21_ | _Branch: `New-core-map`_

---

## Git status

```bash
New-core-map

bf37f347 Update NELIE avatar size and improve comments
7f79fb60 docs: add __CONTEXT_SNAPSHOT.md (main snapshot)
1146cb86 docs: add __CONTEXT_SNAPSHOT.md (New-core-map)
```

## Vite + TS/aliases (vite.config.ts, tsconfig.json)

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@features": path.resolve(__dirname, "src/features"),
      "@services": path.resolve(__dirname, "src/services"),
    },
  },
  server: {
    port: 5173,
  },
});

--- tsconfig.json ---
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@content": ["src/services/content/index.ts"],
      "@content/edge": ["src/services/content/EdgeContentService.ts"],
      "@content/openai": ["src/services/openai/OpenAIContentService.ts"]
    }
  }
}
```

## Routes (src/App.tsx)

```tsx
// src/components/NELIE/NELIE.tsx
import React, { useState, useRef, useEffect } from "react";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

type Pos = { x: number; y: number };

export default function NELIE() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<Pos>({ x: 24, y: 24 });
  const [rel, setRel] = useState<Pos>({ x: 0, y: 0 });
  const startPosRef = useRef<Pos | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { speakAsNelie } = useUnifiedSpeech();

  useEffect(() => {
    const onMove = (x: number, y: number) =>
      setPos({ x: x - rel.x, y: y - rel.y });

    const mm = (e: MouseEvent) => dragging && onMove(e.pageX, e.pageY);
    const mu = () => setDragging(false);

    const tm = (e: TouchEvent) => {
      if (!dragging) return;
      const t = e.touches[0];
      if (t) onMove(t.pageX, t.pageY);
    };
    const tu = () => setDragging(false);

    document.addEventListener("mousemove", mm);
    document.addEventListener("mouseup", mu);
    document.addEventListener("touchmove", tm, { passive: false });
    document.addEventListener("touchend", tu);

    return () => {
      document.removeEventListener("mousemove", mm);
      document.removeEventListener("mouseup", mu);
      document.removeEventListener("touchmove", tm);
      document.removeEventListener("touchend", tu);
    };
  }, [dragging, rel]);

  const beginDrag = (pageX: number, pageY: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setDragging(true);
    setRel({ x: pageX - r.left, y: pageY - r.top });
    startPosRef.current = { x: pageX, y: pageY };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    beginDrag(e.pageX, e.pageY);
    e.preventDefault();
    e.stopPropagation();
  };
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    beginDrag(t.pageX, t.pageY);
    e.preventDefault();
    e.stopPropagation();
  };

  const onClick = () => {
    const s = startPosRef.current;
    if (!s) return setOpen((v) => !v);
    const moved =
      Math.abs(pos.x - (s.x - rel.x)) + Math.abs(pos.y - (s.y - rel.y)) > 6;
    if (!moved) setOpen((v) => !v);
    startPosRef.current = null;
  };

  return (
    <>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={onClick}
        role="button"
        aria-label="NELIE"
        className="fixed z-[9999] w-24 h-24 cursor-move select-none"
        style={{ left: pos.x, top: pos.y, background: "transparent" }}
      >
        <img
          src="/nelie.png"
          alt="NELIE"
          className="nelie-avatar w-full h-full pointer-events-none"
          draggable={false}
        />
      </div>

      {open && (
        <div
          className="fixed z-[10000] w-80 rounded-lg shadow-xl p-3 bg-white dark:bg-neutral-900 border border-black/5"
          style={{ left: pos.x - 280, top: pos.y - 20 }}
        >
          <div className="font-bold text-blue-600 dark:text-blue-400 mb-2">
            NELIE
          </div>
          <textarea
            className="w-full border rounded p-2 text-sm bg-white/70 dark:bg-neutral-800"
            rows={4}
            placeholder="Skriv til NELIE..."
          />
          <button
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm"
            onClick={() =>
              speakAsNelie("Hej, jeg er NELIE. Hvad vil du lære i dag?")
            }
          >
            🔊 Tal
          </button>
        </div>
      )}
    </>
  );
}
```

## Supabase client og env

```bash
src/lib/supabaseClient.ts:18:  _client = createClient(url, anon);

-rw-r--r--@ 1 northstardisc  staff  287 Sep 12 16:21 .env.local
```

**src/lib/supabaseClient.ts** (around "createClient"):

     1  // src/lib/supabaseClient.ts
     2  import { createClient, SupabaseClient } from "@supabase/supabase-js";

    14        "[lib/supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON. " +
    15        "Create .env.local in project root and restart the dev server."
    16      );
    17    }
    18    _client = createClient(url, anon);

**supabase/functions/ai-stream/index.ts** (around "createClient"):

     1  // @ts-nocheck
     2  import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

    17  if (!supabaseUrl || !supabaseServiceKey) {
    18    console.error('Supabase credentials not found');
    19  }
    21  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

## NELIE – komponenter og mounts

```bash
ENHANCED_NELIE_README.md
NELIE_Foundational_Principles.md
__tests__/nelie.test.ts
docs/adr/ADR-0001-nelie-orchestrator.md
docs/spec/NELIE.md
public/nelie.png
restore_nelie.sh
scripts/point-nelie.ts
scripts/port-nelie-from-main.sh
src/components/EnhancedNELIELessonManager.tsx
src/components/NELIE.tsx
src/components/NELIE/NELIE
src/components/NELIE/NELIE.tsx
src/components/NELIE/RefactoredFloatingAITutor.tsx
src/components/NELIE/floating/RefactoredFloatingAITutor.tsx
src/components/NELIE/index.ts
src/components/NELIE/legacy/NELIE.main.tsx
src/components/NELIELauncher.tsx
src/components/SingleNELIE.tsx
src/components/daily-program/NeliesTips.tsx
src/components/education/components/EnhancedNELIELessonManager.tsx
src/components/education/components/NelieAvatarSection.tsx
src/components/education/components/NelieIntroduction.tsx
src/components/education/components/shared/AskNelieButtons.tsx
src/features/nelie/avatar.ts
src/pages/NelieChat.tsx
src/services/NELIESessionGenerator.ts
src/services/nelie/NELIEEngine.main.ts
src/services/nelie/NELIESessionGenerator.main.ts
src/services/nelie/generator.ts
src/types/nelie/NELIESubjects.main.ts

— Mounts —
src/components/SingleNELIE.tsx:30:  return canRender ? <NELIE /> : null;
src/services/NELIESessionGenerator.ts:28:    generateSession: async (config: SessionConfig): Promise<NELIESession> => {
src/services/nelie/NELIESessionGenerator.main.ts:44:  async generatePersonalizedSession(config: NELIESessionConfig): Promise<NELIESession> {
src/services/nelie/NELIESessionGenerator.main.ts:206:  generateQuickSession(subject: string, skillArea: string, studentName: string = 'Student'): Promise<NELIESession> {
src/services/nelie/NELIESessionGenerator.main.ts:389:): Promise<NELIESession> => {
src/components/SingleNELIE.tsx:8:export default function SingleNELIE() {
```

**src/components/SingleNELIE.tsx** (around "NELIE"):

     1  import { useEffect, useState } from "react";
     2  import NELIE from "@/components/NELIE";

     1  import { useEffect, useState } from "react";
     2  import NELIE from "@/components/NELIE";
     4  /**
     5   * Mount exactly one global NELIE instance.

     4  /**
     5   * Mount exactly one global NELIE instance.
     6   * Uses a body data-flag to prevent duplicate mounts across routes/HMR.
     7   */
     8  export default function SingleNELIE() {

     7   */
     8  export default function SingleNELIE() {
     9    const [canRender, setCanRender] = useState(false);
    11    useEffect(() => {
    12      // If someone already mounted NELIE, don't render this instance

    25          delete document.body.dataset.nelieMounted;
    26        }
    27      };
    28    }, []);
    30    return canRender ? <NELIE /> : null;

**src/components/NELIE/NELIE.tsx** (around "FloatingNELIE"):

     1  // src/components/NELIE.tsx
     2  import React from "react";
     3  import FloatingNELIE from "@/components/NELIE/floating/RefactoredFloatingAITutor";

     2  import React from "react";
     3  import FloatingNELIE from "@/components/NELIE/floating/RefactoredFloatingAITutor";
     5  /** Central place to configure theme/size later if needed */
     6  export default function NELIE() {
     7    return <FloatingNELIE />;

**src/components/NELIE/floating/RefactoredFloatingAITutor.tsx** (around "export default function"):

     3  import { generateLesson } from "@/services/contentClient";
     5  /**
     6   * Small floating avatar you can drag. Click to open a chat card.
     7   * - Uses Supabase Edge Function via generateLesson()
     8   * - Speaks responses via useUnifiedSpeech()
     9   * - Safe if env isn't configured (shows hint)
    10   */
    11  export default function RefactoredFloatingAITutor() {

## NELIE – services (parkeret fra main som \*.main.ts)

```bash
src/services/NELIESessionGenerator.ts
src/services/nelie/NELIEEngine.main.ts
src/services/nelie/NELIESessionGenerator.main.ts
src/services/nelie/generator.ts
src/types/nelie/NELIESubjects.main.ts
```

## CSS / index.css (NELIE styles nederst)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 10% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 240 5.9% 90%;
    --sidebar-ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 5% 90%;
    --sidebar-primary: 240 4.9% 83.9%;
    --sidebar-primary-foreground: 240 5.9% 10%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 5% 90%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Ensure floating tutor is always visible */
.floating-tutor-container {
  position: fixed !important;
  z-index: 9999999 !important;
  pointer-events: auto !important;
}

/* Prevent any potential conflicts with other components */
.floating-tutor-container * {
  pointer-events: auto !important;
}

/* 3D Transform Utilities */
@layer utilities {
  .perspective-1000 {
    perspective: 1000px;
  }

  .preserve-3d {
    transform-style: preserve-3d;
  }

  .transform-gpu {
    transform: translate3d(0, 0, 0);
  }

  .rotate-y-12 {
    transform: rotateY(12deg);
  }

  .rotate-x-6 {
    transform: rotateX(6deg);
  }

  .backface-hidden {
    backface-visibility: hidden;
  }

  .translate-z-\[-10px\] {
    transform: translateZ(-10px);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
/* ---- NELIE avatar: større, ingen ring, ingen hvid baggrund ---- */
.nelie-avatar,
.nelie-avatar *,
img[alt="NELIE"] {
  width: 128px !important; /* 2x */
  height: 128px !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  outline: 0 !important;
  /* neutraliser Tailwind ring */
  --tw-ring-offset-shadow: 0 0 #0000 !important;
  --tw-ring-shadow: 0 0 #0000 !important;
  object-fit: contain !important;
}

/* Fjern ring/bg på wrappers der direkte indeholder avataren (kræver :has) */
@supports selector(:has(*)) {
  :where(div, button, span, figure):has(> img.nelie-avatar),
  :where(div, button, span, figure):has(> img[alt="NELIE"]) {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    --tw-ring-offset-shadow: 0 0 #0000 !important;
    --tw-ring-shadow: 0 0 #0000 !important;
  }
}
```

## Andre nøglefiler (auth, daily program, training)

```tsx
--- src/hooks/useAuth.tsx ---
// src/hooks/useAuth.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type Role =
  | "admin"
  | "school_leader"
  | "school_staff"
  | "teacher"
  | "parent"
  | "student"
  | null;

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  userRole: Role;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: Error }>;
  updateUserRole: (next: Role) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function roleFromUser(u: User | null): Role {
  const r =
    (u?.user_metadata as any)?.role ??
    (u as any)?.role ??
    null;
  const allowed = [
    "admin",
    "school_leader",
    "school_staff",
    "teacher",
    "parent",
    "student",
  ];
  return allowed.includes(r) ? (r as Role) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      const sess = data?.session ?? null;
      setSession(sess);
      setUser(sess?.user ?? null);
      setUserRole(roleFromUser(sess?.user ?? null));
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ?? null);
      setUser(sess?.user ?? null);
      setUserRole(roleFromUser(sess?.user ?? null));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      userRole,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
      },
      signInWithPassword: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error } : {};
      },
      updateUserRole: async (next) => {
        setUserRole(next);
        if (user) {
          await supabase.auth.updateUser({
            data: { ...(user.user_metadata ?? {}), role: next ?? undefined },
          });
          const { data } = await supabase.auth.getUser();
          const refreshed = data?.user ?? null;
          setUser(refreshed);
          setUserRole(roleFromUser(refreshed));
        }
      },
    }),
    [user, session, userRole, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

--- src/features/daily-program/pages/DailyProgramPage.tsx ---
import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BookOpen, Play, Loader2 } from 'lucide-react';
import { aiUniverseGenerator } from '@/services/AIUniverseGenerator';
import { Universe, UniverseGenerator } from '@/services/UniverseGenerator';
import { dailyLessonGenerator } from '@/services/dailyLessonGenerator';
import { LessonActivity } from '@/components/education/components/types/LessonTypes';

const DailyProgramPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loadingUniverse, setLoadingUniverse] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonActivities, setLessonActivities] = useState<LessonActivity[] | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const universeRef = useRef<HTMLDivElement | null>(null);


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your daily program...</p>
        </div>
      </div>
    );
  }

  const generateUniverse = async () => {
    setLoadingUniverse(true);
    setError(null);

    try {
      const prompt =
        'Create an engaging daily learning universe for students with interactive activities, interesting characters, and educational adventures.';
      let result = await aiUniverseGenerator.generateUniverse(prompt);
      if (!result) {
        // Fallback to a built-in sample if generation fails completely
        result = UniverseGenerator.getUniverses()[0];
      }

      if (typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch {
          result = UniverseGenerator.getUniverses()[0];
        }
      }

      setUniverse(result);

      // Generate today's lesson activities based on the universe theme
      if (result) {
        await generateLessonFromUniverse(result as Universe);
      }

      // After setting the universe scroll to the details section
      setTimeout(() => {
        universeRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate universe');
      // Show a sample universe so the user still sees content
      setUniverse(UniverseGenerator.getUniverses()[0]);
    } finally {
      setLoadingUniverse(false);
    }
  };

  const generateLessonFromUniverse = async (u: Universe) => {
    if (!user) return;

    setLoadingLesson(true);
    setLessonError(null);

    try {
      const grade = 6;
      const currentDate = new Date().toISOString().split('T')[0];
      const activities = await dailyLessonGenerator.generateDailyLesson({
        subject: u.theme || 'general',
        skillArea: 'general',
        userId: user.id,
        gradeLevel: grade,
        currentDate
      });

      setLessonActivities(activities);
    } catch (err) {
      setLessonError(err instanceof Error ? err.message : 'Failed to generate lesson');
    } finally {
      setLoadingLesson(false);
    }
  };

  const handleStartLearning = () => {
    if (universe) {
      const grade = (user?.user_metadata as any)?.grade_level || 6;
      navigate('/daily-universe-lesson', { state: { universe, gradeLevel: grade } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-purple-400" />
              Today's Program
            </h1>
            <p className="text-gray-300">Welcome back! Here's your personalized AI-generated learning universe for today.</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-primary" />
                Your AI-Generated Learning Universe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                Today's learning adventure is uniquely crafted just for you! Dive into an immersive,
                AI-generated educational universe filled with interactive content, engaging storylines,
                and personalized challenges that adapt to your learning style.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">🎯 Personalized Content</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-crafted lessons that adapt to your progress and interests
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">🌟 Interactive Universe</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore characters, locations, and activities in your learning world
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">⚡ Dynamic Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Content that evolves based on your performance and engagement
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">🎮 Gamified Experience</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn through engaging activities and achievement systems
                  </p>
                </div>
              </div>
              {!universe && (
                <Button
                  onClick={generateUniverse}
                  size="lg"
                  disabled={loadingUniverse}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loadingUniverse ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" /> Start Your Adventure
                    </>
                  )}
                </Button>
              )}
          </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Need More Practice?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Looking for specific subject practice? Visit the Training Ground for focused learning activities.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/training-ground')}
                className="border-border text-foreground hover:bg-accent"
              >
                Go to Training Ground
              </Button>
          </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-center text-destructive">
                  <p className="mb-4">❌ {error}</p>
                  <Button onClick={generateUniverse} variant="outline">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
```
