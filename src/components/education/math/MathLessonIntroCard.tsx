
// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Sparkles, Gauge, Award, BookOpen, Target, Timer, Brain, InfinityIcon } from "lucide-react";
import { useRef } from "react";

// Removed unnecessary/unintended image or preview artifacts

const strengths = ["Problem Solving", "Critical Thinking"];
const growthAreas = ["Speed", "Confidence"];

const features = [
  { icon: <Brain className="w-6 h-6 text-blue-500" />, title: "Adaptive Intelligence", desc: "AI that learns your unique patterns and adapts in real-time." },
  { icon: <Target className="w-6 h-6 text-purple-500" />, title: "Precision Targeting", desc: "Questions tailored to your skill level." },
  { icon: <Timer className="w-6 h-6 text-pink-500" />, title: "Optimal Pacing", desc: "Smart timing—never too fast or slow." },
  { icon: <Award className="w-6 h-6 text-yellow-500" />, title: "Mastery-Based Progress", desc: "Advance only after mastery." },
  { icon: <BookOpen className="w-6 h-6 text-green-500" />, title: "Rich Content Library", desc: "Thousands of unique questions." },
  { icon: <Gauge className="w-6 h-6 text-orange-500" />, title: "Personalized Experience", desc: "Lessons made just for your learning journey." }
];

const MathLessonIntroCard = ({ onStart }: { onStart: () => void }) => {
  const mascotRef = useRef<HTMLImageElement>(null);

  const handleMascotError = () => {
    // Hide the mascot if it fails to load
    if (mascotRef.current) mascotRef.current.style.display = "none";
  };

  return (
    <div className="rounded-2xl max-w-3xl w-full mx-auto shadow-lg bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 border border-slate-800 p-8 mt-8 relative">
      {/* Only the mascot image on the left; no extra previews! */}
      <div className="absolute -left-20 -top-6 hidden md:block bg-transparent p-0 pointer-events-none select-none">
        <img
          ref={mascotRef}
          src="/lovable-uploads/b1659041-6c2b-467e-94f4-aa89e6575277.png"
          alt="AI Tutor Mascot"
          className="h-36 drop-shadow-xl pointer-events-none select-none bg-transparent"
          style={{ userSelect: "none", background: "transparent" }}
          onError={handleMascotError}
          draggable={false}
        />
      </div>
      <h2 className="text-3xl font-extrabold text-center text-blue-300 tracking-tight mb-4">
        World-Class AI Teaching System
      </h2>
      <p className="text-center text-slate-300 mb-6">
        Experience the future of education, where your AI tutor creates personalized sessions just for you.
      </p>

      <div className="rounded-xl flex flex-col md:flex-row gap-5 p-6 mb-6 bg-slate-900 bg-opacity-50 border border-blue-900">
        <div className="flex flex-col flex-1">
          <span className="font-bold text-white mb-1 text-lg">Your Learning Profile · Grade 6</span>
          <div className="flex items-center justify-between">
            <span className="text-slate-200">Engagement</span>
            <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden mx-3">
              <div className="bg-lime-400 h-full w-[85%] rounded-full"></div>
            </div>
            <span className="font-bold text-lime-400">85%</span>
          </div>
          <div className="flex items-center mt-2 justify-between">
            <span className="text-slate-200">Mastery</span>
            <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden mx-3">
              <div className="bg-blue-400 h-full w-[72%] rounded-full"></div>
            </div>
            <span className="font-bold text-blue-300">72%</span>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-slate-200">Focus:</span>
            <span className="ml-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">Mathematics</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-emerald-600/40 px-3 py-1 rounded-full text-emerald-200 text-xs">Problem Solving</span>
            <span className="bg-emerald-600/40 px-3 py-1 rounded-full text-emerald-200 text-xs">Critical Thinking</span>
            <span className="bg-amber-800/20 px-3 py-1 rounded-full text-amber-300 text-xs">Speed</span>
            <span className="bg-amber-800/20 px-3 py-1 rounded-full text-amber-300 text-xs">Confidence</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {features.map((f, idx) => (
          <div key={idx} className="bg-slate-800 rounded-lg p-4 flex flex-col items-start border border-slate-700 shadow">
            {f.icon}
            <h4 className="font-semibold text-white text-base mt-2 mb-1">{f.title}</h4>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-900 via-purple-800 to-fuchsia-800 rounded-xl py-6 px-4 mb-6 flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-10">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">100%</span>
            <span className="text-blue-200 font-semibold">Unique Questions</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center text-2xl font-bold text-purple-200"><Sparkles className="w-6 h-6 mr-1" />AI-Powered</span>
            <span className="text-purple-300 font-semibold">Adaptive Learning</span>
          </div>
          <div className="flex flex-col items-center">
            <InfinityIcon className="text-green-200 w-8 h-8" />
            <span className="text-green-200 font-semibold">Infinite Content</span>
          </div>
        </div>
        <p className="text-blue-100 text-center text-sm mt-4 max-w-lg">
          Every lesson is crafted just for you: totally unique questions, adaptive AI, and endless practice. Get ready for 20–25 minutes of engaging, mastery-based learning!
        </p>
      </div>

      <div className="flex justify-center">
        <Button
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-fuchsia-600 text-white text-lg px-8 py-3 rounded-lg shadow-lg"
          size="lg"
          onClick={onStart}
        >
          Start Your Personalized Mathematics Lesson
        </Button>
      </div>
      <p className="mt-3 text-center text-slate-400 text-sm">Get ready for a learning experience tailored just for you.</p>
    </div>
  );
};

export default MathLessonIntroCard;
