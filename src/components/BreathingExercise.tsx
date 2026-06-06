/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Play, Square, Wind, Info, Sparkles } from "lucide-react";

interface BreathPattern {
  name: string;
  description: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

const PATTERNS: BreathPattern[] = [
  {
    name: "4-7-8 Relaxing Breath",
    description: "Deep somatic relief. Inhale for 4s, hold for 7s, and exhale for 8s.",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
  },
  {
    name: "Box Breathing",
    description: "Resets the nervous system. Inhale, hold, exhale, hold—each for 4s.",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  {
    name: "Equal Calm",
    description: "Quick stabilizing rhythm. Simple 4s inhale and 4s exhale.",
    inhale: 4,
    hold1: 0,
    exhale: 4,
    hold2: 0,
  },
];

export default function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(PATTERNS[0]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "hold_empty">("inhale");
  const [timeLeft, setTimeLeft] = useState<number>(PATTERNS[0].inhale);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset exercise if we change pattern
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(selectedPattern.inhale);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [selectedPattern]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          setPhase((currentPhase) => {
            let nextPhase: typeof phase = "inhale";
            let nextTime = selectedPattern.inhale;

            if (currentPhase === "inhale") {
              if (selectedPattern.hold1 > 0) {
                nextPhase = "hold";
                nextTime = selectedPattern.hold1;
              } else {
                nextPhase = "exhale";
                nextTime = selectedPattern.exhale;
              }
            } else if (currentPhase === "hold") {
              nextPhase = "exhale";
              nextTime = selectedPattern.exhale;
            } else if (currentPhase === "exhale") {
              if (selectedPattern.hold2 > 0) {
                nextPhase = "hold_empty";
                nextTime = selectedPattern.hold2;
              } else {
                nextPhase = "inhale";
                nextTime = selectedPattern.inhale;
              }
            } else if (currentPhase === "hold_empty") {
              nextPhase = "inhale";
              nextTime = selectedPattern.inhale;
            }

            setTimeLeft(nextTime);
            return nextPhase;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, selectedPattern]);

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      setPhase("inhale");
      setTimeLeft(selectedPattern.inhale);
    } else {
      setIsActive(true);
      setPhase("inhale");
      setTimeLeft(selectedPattern.inhale);
    }
  };

  const getBubbleStyle = () => {
    if (!isActive) return { transform: "scale(0.85)", transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)" };
    
    let scaleVal = 0.85;
    let duration = 4;
    
    switch (phase) {
      case "inhale":
        scaleVal = 1.3;
        duration = selectedPattern.inhale;
        break;
      case "hold":
        scaleVal = 1.3;
        duration = selectedPattern.hold1 || 1;
        break;
      case "exhale":
        scaleVal = 0.75;
        duration = selectedPattern.exhale;
        break;
      case "hold_empty":
        scaleVal = 0.75;
        duration = selectedPattern.hold2 || 1;
        break;
    }
    
    return {
      transform: `scale(${scaleVal})`,
      transition: `transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease, border-color 0.5s ease`
    };
  };

  const getPhaseColor = () => {
    if (!isActive) return "bg-slate-50 text-slate-700 border-slate-250 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-750";
    switch (phase) {
      case "inhale":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60";
      case "hold":
        return "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/60";
      case "exhale":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/60";
      case "hold_empty":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800/60";
    }
  };

  const getPhaseText = () => {
    if (!isActive) return "Ready to start?";
    switch (phase) {
      case "inhale":
        return "Breathe In Slowly";
      case "hold":
        return "Hold Your Breath";
      case "exhale":
        return "Exhale Fully & Softly";
      case "hold_empty":
        return "Rest & Pause";
    }
  };

  return (
    <div id="exercise-breathing" className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xs transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">Breathing Space</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Quiet your mind and relieve academic fatigue</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rest & Anchor</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Pattern Selector */}
        <div className="md:col-span-5 space-y-2.5">
          {PATTERNS.map((p) => (
            <button
              key={p.name}
              id={`pattern-btn-${p.name.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedPattern(p)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                selectedPattern.name === p.name
                  ? "bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 shadow-xs"
                  : "bg-transparent border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{p.name}</span>
                {selectedPattern.name === p.name && (
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.description}</p>
            </button>
          ))}

          <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-slate-800/40 border border-blue-100/40 dark:border-slate-800 rounded-2xl text-xs text-blue-800 dark:text-blue-300 mt-2">
            <Info className="w-4 h-4 flex-shrink-0 text-blue-500" />
            <span>Students preparing for JEE/UPSC/NEET find Box or 4-7-8 breathing highly effective for focus before mock tests.</span>
          </div>
        </div>

        {/* Right Column: Interactive breathing ring */}
        <div className="md:col-span-7 flex flex-col items-center justify-center py-6">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Pulsing ring outline */}
            <div className={`absolute inset-0 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 transition-all duration-1000 ${isActive ? "animate-spin [animation-duration:40s]" : ""}`} />

            {/* Scale bubble */}
            <div
              style={getBubbleStyle()}
              className={`w-36 h-36 rounded-full border flex flex-col items-center justify-center text-center p-4 shadow-sm z-10 ${getPhaseColor()}`}
            >
              <span className="text-xs font-semibold tracking-wider uppercase opacity-80 mb-1">
                {isActive ? phase.replace("_", " ") : "Breathe"}
              </span>
              <span className="text-2xl font-bold tracking-tight">
                {timeLeft}
              </span>
              <span className="text-[10px] font-medium mt-1 leading-tight max-w-[100px] opacity-70">
                {isActive ? "seconds left" : "click start"}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              {getPhaseText()}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {isActive 
                ? "Follow the bubble size: expand on inhale, hold, and contract on exhale." 
                : "Find a comfortable seated posture, rest your shoulders, and press Start."}
            </p>

            <button
              id="breathing-toggle-btn"
              onClick={handleToggle}
              className={`mt-4 px-6 py-2.5 rounded-full inline-flex items-center gap-2 text-sm font-semibold transition-all border ${
                isActive
                  ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                  : "bg-teal-600 dark:bg-teal-500 hover:bg-teal-700 dark:hover:bg-teal-600 border-transparent text-white shadow-xs"
              }`}
            >
              {isActive ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Exercise</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Exercise</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
