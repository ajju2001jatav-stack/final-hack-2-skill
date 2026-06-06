/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Clock, Brain, Coffee, Award } from "lucide-react";

interface Preset {
  label: string;
  duration: number; // in minutes
  type: "study" | "break";
}

const PRESETS: Preset[] = [
  { label: "Standard Pomodoro", duration: 25, type: "study" },
  { label: "JEE/NEET Mock Practice", duration: 45, type: "study" },
  { label: "UPSC Long Sprint", duration: 60, type: "study" },
  { label: "Short Recovery Break", duration: 5, type: "break" },
  { label: "Long Mind Recharge", duration: 15, type: "break" },
];

export default function PomodoroTimer() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(PRESETS[0].duration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsRunning(false);
    setTimeLeft(selectedPreset.duration * 60);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [selectedPreset]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          // Alert via simple user-friendly alert alternative if possible, but let's do state notification
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedPreset.duration * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const percentComplete = ((selectedPreset.duration * 60 - timeLeft) / (selectedPreset.duration * 60)) * 100;

  return (
    <div id="exercise-pomodoro" className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xs transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">Exam Study Timer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pace your learning sprints and build brain endurance</p>
          </div>
        </div>
        <span className="text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-full">
          Deep Focus
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Presets List */}
        <div className="md:col-span-5 space-y-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              id={`preset-btn-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedPreset(preset)}
              className={`w-full text-left p-3 rounded-2xl border flex items-center justify-between transition-all ${
                selectedPreset.label === preset.label
                  ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 shadow-xs"
                  : "bg-transparent border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {preset.type === "study" ? (
                  <Brain className="w-4 h-4 text-rose-500" />
                ) : (
                  <Coffee className="w-4 h-4 text-emerald-500" />
                )}
                <div>
                  <div className="font-medium text-sm text-slate-800 dark:text-slate-200">{preset.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {preset.type === "study" ? "Academic Focus Sprint" : "Cognitive Break"}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                {preset.duration}m
              </span>
            </button>
          ))}
        </div>

        {/* Big Display Timer */}
        <div className="md:col-span-7 flex flex-col items-center justify-center py-4 bg-slate-50/40 dark:bg-slate-800/20 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/40">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Simple Radial Border representation using Tailwind gradient, styled elegantly */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-rose-500 transition-all duration-300"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentComplete / 100)}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>

            {/* In-circle text */}
            <div className="z-10 text-center">
              <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white font-mono">
                {formatTime(timeLeft)}
              </span>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {isRunning ? "Running" : "Paused"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              id="pomodoro-toggle-btn"
              onClick={toggleTimer}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-xs flex items-center gap-2 ${
                isRunning
                  ? "bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                  : "bg-rose-500 hover:bg-rose-600 text-white border border-transparent"
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? "Pause" : "Start"}</span>
            </button>

            <button
              id="pomodoro-reset-btn"
              onClick={resetTimer}
              className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-all"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {timeLeft === 0 && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-xl">
              <Award className="w-4 h-4" />
              <span>Great job! You logged an interval. Take a break!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
