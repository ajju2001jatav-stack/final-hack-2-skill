/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { 
  Heart, 
  Sparkles, 
  Plus, 
  MapPin, 
  BookOpen, 
  Calendar, 
  Award, 
  Activity, 
  Brain, 
  ChevronRight, 
  CloudLightning, 
  PhoneCall, 
  LogOut, 
  Save, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Moon,
  Compass
} from "lucide-react";
import { MoodLog, MoodValue, WellnessConfig } from "./types";
import BreathingExercise from "./components/BreathingExercise";
import PomodoroTimer from "./components/PomodoroTimer";
import MoodCharts from "./components/MoodCharts";
import AIWellnessChat from "./components/AIWellnessChat";
import { EXAM_PRESETS, PREDEFINED_TRIGGERS } from "./constants";
import { calculateStreak } from "./utils/streak";
import { getExamTheme } from "./utils/theme";

export default function App() {
  const [isPending, startTransition] = useTransition();
  // ----------------------------------------------------
  // Persistent Offline States (lazy loading)
  // ----------------------------------------------------
  const [logs, setLogs] = useState<MoodLog[]>(() => {
    try {
      const saved = localStorage.getItem("mindspace_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [config, setConfig] = useState<WellnessConfig>(() => {
    try {
      const saved = localStorage.getItem("mindspace_config");
      if (saved) return JSON.parse(saved);
    } catch {}
    
    // Default config
    const randomKey = "IND-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    return { targetExam: "JEE", syncKey: randomKey };
  });

  const theme = useMemo(() => getExamTheme(config.targetExam), [config.targetExam]);

  // ----------------------------------------------------
  // Interactive Active Check-in Form States
  // ----------------------------------------------------
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [journalText, setJournalText] = useState<string>("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState<string>("");
  
  // Reflection Prompt Inputs
  const [todayHard, setTodayHard] = useState<string>("");
  const [todayWell, setTodayWell] = useState<string>("");
  const [tomorrowWill, setTomorrowWill] = useState<string>("");

  // Notification / Status feedback message
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync Input Text State
  const [syncInputKey, setSyncInputKey] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Active View Tab Selection
  // tabs: "checkin" | "timers" | "ai" | "trends" | "settings"
  const [activeTab, setActiveTab] = useState<"checkin" | "timers" | "ai" | "trends" | "settings">("checkin");

  // Save changes to localStorage on logs update
  useEffect(() => {
    localStorage.setItem("mindspace_logs", JSON.stringify(logs));
  }, [logs]);

  // Save changes to localStorage on config update
  useEffect(() => {
    localStorage.setItem("mindspace_config", JSON.stringify(config));
  }, [config]);

  // Dismiss feedback messages after 5 seconds
  useEffect(() => {
    if (feedbackMsg) {
      const t = setTimeout(() => setFeedbackMsg(null), 5000);
      return () => clearTimeout(t);
    }
  }, [feedbackMsg]);

  // Time-of-day Prompt Awareness
  const isMorning = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12;
  }, []);

  // Compute stats and indicators
  const currentStreak = useMemo(() => calculateStreak(logs), [logs]);

  // Trigger Crisis Alert rule: if mood <= 2 for 3+ consecutive logged days
  const triggersCrisisAlert = useMemo(() => {
    // Sort logs descending to look at the latest 3 updates
    const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    if (sorted.length < 3) return false;
    return sorted.slice(0, 3).every(log => log.mood <= 2);
  }, [logs]);

  // Dynamically Match Wellness advisory tips based on user's selected/latest logs
  const contextualAdvice = useMemo(() => {
    if (logs.length === 0) {
      return {
        title: "Welcome aboard, Scholar!",
        text: "Make your first daily check-in below to receive active cognitive tips structured for high-volume exam preparation.",
        icon: <Sparkles className="w-4 h-4 text-indigo-500" />
      };
    }
    const latestLog = [...logs].sort((a, b) => b.timestamp - a.timestamp)[0];
    const mood = latestLog.mood;

    if (mood <= 2) {
      return {
        title: "Anxiety & Study Fatigue Defense",
        text: "In intense prep like UPSC or JEE, low test performance can trigger severe tunnel-vision. Breathe for 4 minutes using the 'Breathing Space' exercise, log a short walk, and surface iCall if pressure becomes overwhelming.",
        icon: <CloudLightning className="w-4 h-4 text-rose-500" />
      };
    } else if (mood === 3) {
      return {
        title: "Stabilizing Prep Pace",
        text: "You are doing okay but mental gears are grinding. Break syllabus targets into 25-minute Pomodoro sprints. Prioritize drinking active water and taking physical breaks from screen glare.",
        icon: <Compass className="w-4 h-4 text-amber-500" />
      };
    } else {
      return {
        title: "Maintaining Positive Momentum",
        text: "Perfect focus energy today! Guard this state: sleep at least 7-8 hours tonight to consolidate your memorized formulas and notes. Do not pull unneeded all-nighters.",
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />
      };
    }
  }, [logs]);

  // Pre-fill active check-in form if logged today
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayLog = logs.find(log => log.date === todayStr);
    if (todayLog) {
      setSelectedMood(todayLog.mood);
      setSelectedTriggers(todayLog.triggers || []);
      setJournalText(todayLog.journal || "");
      setTodayHard(todayLog.reflection?.todayHard || "");
      setTodayWell(todayLog.reflection?.todayWell || "");
      setTomorrowWill(todayLog.reflection?.tomorrowWill || "");
    } else {
      // Clear for a new day if no log found
      setSelectedMood(null);
      setSelectedTriggers([]);
      setJournalText("");
      setTodayHard("");
      setTodayWell("");
      setTomorrowWill("");
    }
  }, [logs]);

  // Handle Log Submissions
  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      setFeedbackMsg({ type: "error", text: "Please press one of the emojis to log your core mood state." });
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    
    const newLog: MoodLog = {
      id: todayStr, // One per day
      date: todayStr,
      timestamp: Date.now(),
      mood: selectedMood,
      journal: journalText.substring(0, 500),
      triggers: selectedTriggers,
      reflection: {
        todayHard,
        todayWell,
        tomorrowWill
      }
    };

    setLogs((prev) => {
      const idx = prev.findIndex(item => item.date === todayStr);
      if (idx > -1) {
        // Overwrite
        const updated = [...prev];
        updated[idx] = newLog;
        return updated;
      }
      return [...prev, newLog];
    });

    setFeedbackMsg({ type: "success", text: "Check-in logged successfully! Your consistency streak has updated." });
  };

  // Add Custom Trigger Input
  const handleAddCustomTrigger = () => {
    const clean = customTrigger.trim();
    if (!clean) return;
    if (selectedTriggers.includes(clean)) {
      setCustomTrigger("");
      return;
    }
    setSelectedTriggers(prev => [...prev, clean]);
    setCustomTrigger("");
  };

  const toggleTriggerSelection = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  // Sync back-ups with sever anonymously
  const handleUploadBackup = async () => {
    setIsSyncing(true);
    setFeedbackMsg(null);
    try {
      const payload = {
        syncKey: config.syncKey,
        data: JSON.stringify({ logs, targetExam: config.targetExam })
      };
      const res = await fetch("/api/sync/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Sync failed at api backend");
      
      setConfig(prev => ({ ...prev, lastSyncTime: Date.now() }));
      setFeedbackMsg({ type: "success", text: "Encrypted data secured in Cloud! Keep your Sync Key safe." });
    } catch (e: any) {
      setFeedbackMsg({ type: "error", text: "Sync failed. Connection problem or offline server." });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadBackup = async (event: React.FormEvent) => {
    event.preventDefault();
    const keyToUse = syncInputKey.trim().toUpperCase();
    if (!keyToUse) {
      setFeedbackMsg({ type: "error", text: "Kindly enter a valid Sync Key first." });
      return;
    }

    setIsSyncing(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/sync/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncKey: keyToUse })
      });
      
      if (!res.ok) {
        throw new Error("Backup key not validated");
      }
      
      const resData = await res.json();
      const parsed = JSON.parse(resData.data);
      if (parsed.logs) {
        setLogs(parsed.logs);
        setConfig(prev => ({ ...prev, targetExam: parsed.targetExam || prev.targetExam, syncKey: keyToUse, lastSyncTime: Date.now() }));
        setFeedbackMsg({ type: "success", text: "Cloud sync retrieved! Your journal, logs, and stats are populated successfully." });
        setSyncInputKey("");
      }
    } catch (e: any) {
      setFeedbackMsg({ type: "error", text: "Data retrieval failed. Please review the key and ensure the backend is online." });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateExam = (exam: string) => {
    setConfig(prev => ({ ...prev, targetExam: exam }));
  };

  // Simple rule-based weekly summary advisory
  const weeklySummaryReport = useMemo(() => {
    if (logs.length === 0) return null;
    const totalMood = logs.reduce((sum, l) => sum + l.mood, 0);
    const avgMood = (totalMood / logs.length).toFixed(1);
    
    // Most recurring stress factor calculation
    const allTriggers: string[] = [];
    logs.forEach(l => allTriggers.push(...(l.triggers || [])));
    
    const counts: Record<string, number> = {};
    allTriggers.forEach(t => counts[t] = (counts[t] || 0) + 1);
    const sortedTriggers = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    const topStressor = sortedTriggers[0]?.[0] || "None logged yet";

    return {
      avgMood,
      topStressor,
      evalText: parseFloat(avgMood) >= 3.8 
        ? "Excellent resilience! You are handling pressure brilliantly." 
        : parseFloat(avgMood) >= 2.8 
          ? "Stable. You have stressors but are logging actively. Maintain Pomodoro intervals." 
          : "System experiencing high tension levels. Prioritize sleep hygiene, decrease practice load, and consult iCall/helpline to talk through feelings."
    };
  }, [logs]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-all">
      {/* Top Banner for Crisis helplines */}
      {(triggersCrisisAlert || selectedMood !== null && selectedMood <= 2) && (
        <div id="crisis-alert-banner" className="bg-rose-500 text-white py-3 px-4 shadow-md z-50 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-3 relative animate-bounce [animation-iteration-count:3]">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs md:text-sm font-bold">
              <span className="uppercase tracking-wider mr-1 bg-white text-rose-600 px-1.5 py-0.5 rounded-sm">Crisis Guard Activated:</span>
              Your logged logs indicate heightened distress. Your pressure levels are high. Speak to kind listeners right away.
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold">
            <span className="bg-slate-900/40 px-2.5 py-1 rounded-full">
              iCall (TISS): <a href="tel:9152987821" className="underline font-bold">9152987821</a> (Mon-Sat, 10am-8pm)
            </span>
            <span className="bg-slate-900/40 px-2.5 py-1 rounded-full">
              Vandrevala Foundation: <a href="tel:9999666555" className="underline font-bold">9999666555</a> (24/7)
            </span>
          </div>
        </div>
      )}

      {/* Main navigation header */}
      <header className="border-b border-slate-100 dark:border-slate-900 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${theme.iconHeroBg} flex items-center justify-center text-white shadow-md ${theme.shadowAccent} transition-transform hover:scale-105`}>
              <Heart className="w-5 h-5 fill-current scale-105" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white">MindSpace</h1>
                <span className={`text-[10px] ${theme.badgeBg} ${theme.badgeText} font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 border ${theme.borderLight}`}>
                  <span>{config.targetExam} prep</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">Mental Wellness Tracker for Competitive Exams</p>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/50 rounded-2xl p-2 px-3.5 flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-500 fill-current animate-pulse" />
              <div className="text-left">
                <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider leading-none">Reflection Streak</span>
                <span className="text-sm font-black text-slate-800 dark:text-amber-200">{currentStreak} {currentStreak === 1 ? "Day" : "Days"}</span>
              </div>
            </div>

            {/* Helpline quick-link */}
            <div className="hidden sm:flex bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/50 rounded-2xl p-2 px-3.5 items-center gap-2.5">
              <PhoneCall className="w-4.5 h-4.5 text-rose-500 fill-current" />
              <div className="text-left text-xs">
                <span className="block text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-widest leading-none">iCall Helpline</span>
                <a href="tel:9152987821" className="font-extrabold text-rose-700 dark:text-rose-450 underline">9152987821</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main app layout content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* State Notification banners */}
        {feedbackMsg && (
          <div 
            id="status-alert"
            className={`p-4 rounded-2xl text-sm font-semibold border shadow-xs flex items-center gap-2.5 animate-fadeIn ${
              feedbackMsg.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900" 
                : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-350 dark:border-rose-900"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${feedbackMsg.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}></div>
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Dynamic Contextual Advisory Recommendation box */}
        <div id="wellness-tip-box" className={`bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} p-5 rounded-3xl border ${theme.borderLight} dark:border-slate-800 flex items-start gap-4 shadow-xs`}>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xs flex-shrink-0">
            {contextualAdvice.icon}
          </div>
          <div className="space-y-1">
            <h4 className={`font-bold text-sm text-slate-800 ${theme.textGradientLight} flex items-center gap-1.5`}>
              <span>{contextualAdvice.title}</span>
              <span className={`text-[9px] ${theme.badgeBgDark} ${theme.badgeTextAlt} uppercase tracking-widest px-2 py-0.5 rounded-md font-extrabold`}>Advisory</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-350 font-medium leading-relaxed">
              {contextualAdvice.text}
            </p>
          </div>
        </div>

        {/* View Tabs Selector */}
        <div className="flex border-b border-slate-100 dark:border-slate-900 overflow-x-auto no-scrollbar gap-1.5 pt-1">
          <button
            id="tab-btn-checkin"
            onClick={() => setActiveTab("checkin")}
            aria-current={activeTab === "checkin" ? "page" : undefined}
            className={`px-4 py-3 text-xs sm:text-sm font-display font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "checkin"
                ? `${theme.borderActive} ${theme.primaryTextVibrant} ${theme.bgLight_20} font-extrabold`
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <BookOpen className={`w-4 h-4 shrink-0 ${theme.primaryText}`} />
            <span>Daily Check-In</span>
          </button>
          
          <button
            id="tab-btn-ai"
            onClick={() => setActiveTab("ai")}
            aria-current={activeTab === "ai" ? "page" : undefined}
            className={`px-4 py-3 text-xs sm:text-sm font-display font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "ai"
                ? `${theme.borderActive} ${theme.primaryTextVibrant} ${theme.bgLight_20} font-extrabold`
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${theme.primaryText}`} />
            <span>AI Companion</span>
          </button>
          
          <button
            id="tab-btn-timers"
            onClick={() => setActiveTab("timers")}
            aria-current={activeTab === "timers" ? "page" : undefined}
            className={`px-4 py-3 text-xs sm:text-sm font-display font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "timers"
                ? `${theme.borderActive} ${theme.primaryTextVibrant} ${theme.bgLight_20} font-extrabold`
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Brain className={`w-4 h-4 shrink-0 ${theme.primaryText}`} />
            <span>Study Timer & Breathing</span>
          </button>
          
          <button
            id="tab-btn-trends"
            onClick={() => setActiveTab("trends")}
            aria-current={activeTab === "trends" ? "page" : undefined}
            className={`px-4 py-3 text-xs sm:text-sm font-display font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "trends"
                ? `${theme.borderActive} ${theme.primaryTextVibrant} ${theme.bgLight_20} font-extrabold`
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <TrendingUp className={`w-4 h-4 shrink-0 ${theme.primaryText}`} />
            <span>Progress Analytica</span>
          </button>
          
          <button
            id="tab-btn-settings"
            onClick={() => setActiveTab("settings")}
            aria-current={activeTab === "settings" ? "page" : undefined}
            className={`px-4 py-3 text-xs sm:text-sm font-display font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "settings"
                ? `${theme.borderActive} ${theme.primaryTextVibrant} ${theme.bgLight_20} font-extrabold`
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <ShieldCheck className={`w-4 h-4 shrink-0 ${theme.primaryText}`} />
            <span>Secure Backup</span>
          </button>
        </div>

        {/* View Layouts mapped on selection tabs */}
        <div className="space-y-6">
          
          {/* TAB 1: DAILY CHECK-IN */}
          {activeTab === "checkin" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Check-In Logging Form */}
              <form 
                id="main-checkin-form"
                onSubmit={handleSaveCheckIn}
                className="lg:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs"
              >
                {/* Time of day prompts differ header */}
                <div className="space-y-1">
                  <span className={`text-[10px] ${theme.primaryText} uppercase tracking-widest font-extrabold flex items-center gap-1.5`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Focus Check Point</span>
                  </span>
                  <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
                    {isMorning 
                      ? "Set a healthy mental anchor for your prep today. How are you feeling this morning?" 
                      : "Reflect on today's study sprints. How is your energy and mind feeling tonight?"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Today is {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>

                {/* 1. Emoji Selection Scale */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Step 1: Core Sentiment (1 to 5)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { value: 1, emoji: "😢", label: "Terrible" },
                      { value: 2, emoji: "😰", label: "Anxious / Low" },
                      { value: 3, emoji: "😐", label: "Ok / Neutral" },
                      { value: 4, emoji: "🙂", label: "Good focus" },
                      { value: 5, emoji: "✨", label: "Great / Clear" },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.value}
                        id={`mood-btn-${m.value}`}
                        onClick={() => setSelectedMood(m.value as MoodValue)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          selectedMood === m.value
                            ? `${theme.moodSelectBg} ${theme.borderActive} ${theme.moodSelectDarkBg} transform scale-102 shadow-xs`
                            : "bg-transparent border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <span className="block text-2.5xl mb-1.5 leading-none">{m.emoji}</span>
                        <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                          {m.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Predefined academic triggers */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step 2: Stress Trigger Identification
                    </label>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Identify academic or routine factors dragging down focus</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_TRIGGERS.map((trigger) => {
                      const isSelected = selectedTriggers.includes(trigger);
                      return (
                        <button
                          type="button"
                          key={trigger}
                          id={`trigger-btn-${trigger.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => toggleTriggerSelection(trigger)}
                          className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition-all ${
                            isSelected
                              ? `${theme.triggerSelectedBg} text-white border-transparent`
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          {trigger}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Optional custom trigger */}
                  <div className="flex gap-2">
                    <input
                      id="custom-trigger-input"
                      type="text"
                      value={customTrigger}
                      onChange={(e) => setCustomTrigger(e.target.value)}
                      placeholder="Add custom trigger (e.g., 'Chemistry Mock', 'Math formula backlogs')..."
                      className={`flex-1 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-3.5 py-2 focus:ring-1 ${theme.focusRing} font-medium text-slate-700 dark:text-slate-200`}
                    />
                    <button
                      type="button"
                      id="add-custom-trigger-btn"
                      onClick={handleAddCustomTrigger}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200 text-xs text-slate-700 dark:text-slate-300 border border-transparent flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* 3. Free text journal entry */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Step 3: Daily Reflection Journal (Optional)
                    </label>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {500 - journalText.length} chars left
                    </span>
                  </div>
                  <textarea
                    id="journal-textarea"
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value.substring(0, 500))}
                    placeholder="Write a private, judgment-free reflection. Release toxic stress. Talk through whatever formulas, chapters, or family issues are cluttering your space..."
                    rows={3}
                    className={`w-full text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 focus:ring-1 ${theme.focusRing} font-medium text-slate-800 dark:text-slate-200 leading-relaxed`}
                  />
                </div>

                {/* 4. Deep Guided reflection Prompts */}
                <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className={`w-4 h-4 ${theme.primaryText}`} />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Step 4: Self-Decompression Prompts</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        What made today hard?
                      </label>
                      <input
                        id="prompt-hard-input"
                        type="text"
                        value={todayHard}
                        onChange={(e) => setTodayHard(e.target.value)}
                        placeholder="e.g. Physics organic formula..."
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        One thing I managed well today
                      </label>
                      <input
                        id="prompt-well-input"
                        type="text"
                        value={todayWell}
                        onChange={(e) => setTodayWell(e.target.value)}
                        placeholder="e.g. Cleared 20 PYQs"
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Tomorrow I will...
                      </label>
                      <input
                        id="prompt-tomorrow-input"
                        type="text"
                        value={tomorrowWill}
                        onChange={(e) => setTomorrowWill(e.target.value)}
                        placeholder="e.g. Target the physics lecture..."
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    id="save-checkin-btn"
                    className={`px-6 py-3 ${theme.btnBg} text-white font-bold rounded-2xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm ${theme.shadowAccent}`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Secure Today's Reflection</span>
                  </button>
                </div>
              </form>

              {/* Sidebar Guide Info */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Micro Streaks rewards & badges */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                  <div className="flex items-center gap-2 mb-3.5">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Wellness Milestones</h4>
                  </div>

                  <div className="space-y-3">
                    {[
                      { days: 1, label: "Anchor Forged", desc: "Logged first sentiment marker" },
                      { days: 3, label: "Resilience Foundation", desc: "Logged 3 consecutive prep cycles" },
                      { days: 7, label: "Self-Knowledge Mastery", desc: "Active self-reflection for 7 days" },
                    ].map((badge) => {
                      const earned = currentStreak >= badge.days;
                      return (
                        <div 
                          key={badge.days}
                          className={`p-3 border rounded-2xl flex items-center gap-3.5 transition-all ${
                            earned 
                              ? "bg-amber-50/40 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-900/40" 
                              : "border-slate-100 dark:border-slate-805 opacity-45"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${earned ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"}`}>
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{badge.label}</div>
                            <div className="text-[10px] text-slate-500">{badge.desc} ({badge.days} {badge.days === 1 ? "day" : "days"})</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Exam target selection */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Sliders className={`w-4.5 h-4.5 ${theme.primaryText}`} />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Configure Exam Focus</h4>
                  </div>

                  {/* Personalised motivator box */}
                  <div className={`p-3 rounded-2xl ${theme.bgLight_20} border ${theme.borderLight} text-[11px] font-medium text-slate-605 dark:text-slate-350 leading-relaxed mb-4.5`}>
                    <p>
                      <strong className={`${theme.primaryTextVibrant}`}>{theme.title} Active: </strong>
                      <span className="italic">{theme.motivation}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 font-display">
                    {EXAM_PRESETS.map((x) => (
                      <button
                        type="button"
                        key={x}
                        id={`exam-preset-btn-${x.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleUpdateExam(x)}
                        className={`text-xs p-2.5 font-bold rounded-xl border text-center transition-all ${
                          config.targetExam === x
                            ? `${theme.btnBg} text-white border-transparent`
                            : "bg-transparent text-slate-700 dark:text-slate-350 border-slate-150 dark:border-slate-805 hover:bg-slate-50"
                        }`}
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: AI COMPANION */}
          {activeTab === "ai" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <AIWellnessChat currentExam={config.targetExam} />
              </div>

              {/* Indian helplines & crisis fallback numbers always visible in chat tab */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4">
                  <h4 className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                    <PhoneCall className="w-4.5 h-4.5" />
                    <span>Emergency Crisis resources</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Preparing for heavy competitive exams is tough but remember: **your health is worth infinitely more than any rank.** If you hit severe breakdowns or need immediate counsel, reach out to supportive listeners:
                  </p>

                  <div className="space-y-2.5">
                    <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100/70 dark:border-slate-805">
                      <span className="block text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-0.5">Vandrevala Foundation</span>
                      <a href="tel:9999666555" className="text-sm font-black underline text-slate-800 dark:text-slate-200">9999666555</a>
                      <span className="text-[10px] text-slate-500 block leading-tight mt-1">24/7 • Free, confidential, compassionate assistance</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100/70 dark:border-slate-805">
                      <span className="block text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-0.5">iCall TISS Helpline</span>
                      <a href="tel:9152987821" className="text-sm font-black underline text-slate-800 dark:text-slate-200">9152987821</a>
                      <span className="text-[10px] text-slate-500 block leading-tight mt-1">Mon-Sat, 10 AM - 8 PM • Multilingual assistance</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100/70 dark:border-slate-805">
                      <span className="block text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-0.5">AASRA India</span>
                      <a href="tel:919820466726" className="text-sm font-black underline text-slate-800 dark:text-slate-200">91-9820466726</a>
                      <span className="text-[10px] text-slate-500 block leading-tight mt-1">24/7 Support line</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMERS AND BREATHING */}
          {activeTab === "timers" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BreathingExercise />
              <PomodoroTimer />
            </div>
          )}

          {/* TAB 4: PROGRESS TRENDS */}
          {activeTab === "trends" && (
            <div className="space-y-6">
              
              {/* Dynamic Wellness Report Card */}
              {weeklySummaryReport && (
                <div className={`p-6 ${theme.btnBg} rounded-3xl text-white shadow-xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center`}>
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-md font-extrabold">Active Wellness Analysis Report</span>
                    <h3 className="text-xl font-black tracking-tight">Student Mental Quotient Evaluation</h3>
                    <p className="text-xs text-indigo-100 max-w-xl font-medium leading-relaxed">
                      {weeklySummaryReport.evalText}
                    </p>
                  </div>

                  <div className="flex gap-4 shrink-0">
                    <div className="p-4.5 bg-white/10 rounded-2xl text-center border border-white/10 min-w-[90px]">
                      <span className="text-2xl font-black">{weeklySummaryReport.avgMood}</span>
                      <span className="block text-[9px] uppercase tracking-wider mt-1 opacity-70">Avg Mood Rating</span>
                    </div>
                    <div className="p-4.5 bg-white/10 rounded-2xl text-center border border-white/10 max-w-[150px]">
                      <span className="text-sm font-black leading-tight line-clamp-1">{weeklySummaryReport.topStressor}</span>
                      <span className="block text-[9px] uppercase tracking-wider mt-2 opacity-70">Top Stress Factor</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline SVG Charts and Heatmap container */}
              <MoodCharts logs={logs} />
            </div>
          )}

          {/* TAB 5: SECURE CLOUD SYNC */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Sync Configuration Pane */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Secure Cloud Synchronization</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Maintain an anonymous encrypted back-up of all your logs on the server</p>
                  </div>
                </div>

                <div className="p-4.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-150 dark:border-slate-805 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500">Your Generated Sync Key</span>
                    <span className="font-sans font-black text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border dark:border-slate-700">
                      {config.syncKey}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    **This is anonymous.** No personal email or identity is ever logged to the cloud databases. This randomly generated key acts as your private retrieval system. Copy or save it somewhere!
                  </p>

                  <div className="flex justify-between items-center border-t dark:border-slate-800 pt-3 text-[10px] font-medium text-slate-405">
                    <span>Last Synced:</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-355">
                      {config.lastSyncTime ? new Date(config.lastSyncTime).toLocaleString() : "Never synced yet"}
                    </span>
                  </div>
                </div>

                {/* Upload action button */}
                <button
                  id="upload-backup-btn"
                  onClick={handleUploadBackup}
                  disabled={isSyncing || logs.length === 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {isSyncing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Store Sealed Backup to Cloud</span>
                </button>
              </div>

              {/* Sync Retrieve Backup */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 ${theme.bgLight_20} ${theme.primaryText} rounded-xl`}>
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Load Backup</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Load previously configured exam logs using your Sync Key</p>
                  </div>
                </div>

                <form id="download-backup-form" onSubmit={handleDownloadBackup} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Enter synchronization Key
                    </label>
                    <input
                      id="sync-key-input"
                      type="text"
                      required
                      value={syncInputKey}
                      onChange={(e) => setSyncInputKey(e.target.value)}
                      placeholder="e.g., IND-DF15..."
                      className="w-full text-sm bg-slate-55 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-800 rounded-2xl px-4 py-3 font-semibold tracking-widest text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    id="download-backup-btn"
                    disabled={isSyncing}
                    className={`w-full py-3 ${theme.btnBg} text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40`}
                  >
                    {isSyncing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span>Import Cloud Backup</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Footer support credits representation */}
      <footer className="border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-450">
        <p className="font-medium text-slate-500">
          MindSpace is a free, open-source mental wellness self-care system designed for competitive exams.
        </p>
        <p className="text-[10px] opacity-75 mt-1">
          Made for JEE, NEET, UPSC, SAT, CAT, and Board Students. All clinical/crisis resources provided by iCall and Vandrevala Foundation.
        </p>
      </footer>
    </div>
  );
}
