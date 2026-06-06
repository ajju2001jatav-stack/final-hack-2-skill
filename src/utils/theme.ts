/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExamTheme {
  key: string;
  primaryText: string;
  primaryTextVibrant: string;
  bgLight_20: string;
  bgLight_30: string;
  borderActive: string;
  borderNormal: string;
  borderLight: string;
  badgeBg: string;
  badgeBgDark: string;
  badgeText: string;
  badgeTextAlt: string;
  iconHeroBg: string;
  shadowAccent: string;
  gradientFrom: string;
  gradientTo: string;
  textGradientLight: string;
  moodSelectBg: string;
  moodSelectBorder: string;
  moodSelectDarkBg: string;
  triggerSelectedBg: string;
  focusRing: string;
  btnBg: string;
  btnBgSec: string;
  trendsReportBg: string;
  trendsReportText: string;
  title: string;
  motivation: string;
}

export function getExamTheme(exam: string): ExamTheme {
  switch (exam) {
    case "JEE":
      return {
        key: "sky",
        primaryText: "text-sky-600 dark:text-sky-450",
        primaryTextVibrant: "text-sky-600 dark:text-sky-400",
        bgLight_20: "bg-sky-50/20 dark:bg-sky-950/20",
        bgLight_30: "bg-sky-50/30 dark:bg-sky-950/30",
        borderActive: "border-sky-600 dark:border-sky-500",
        borderNormal: "border-sky-200 dark:border-sky-800",
        borderLight: "border-sky-100/50 dark:border-sky-900/40",
        badgeBg: "bg-sky-50 dark:bg-sky-950/40",
        badgeBgDark: "bg-sky-100 dark:bg-sky-950/80",
        badgeText: "text-sky-600 dark:text-sky-400",
        badgeTextAlt: "text-sky-700 dark:text-sky-305",
        iconHeroBg: "bg-sky-600",
        shadowAccent: "shadow-sky-100 dark:shadow-none",
        gradientFrom: "from-sky-50/75 dark:from-slate-900",
        gradientTo: "to-indigo-50/45 dark:to-slate-900/60",
        textGradientLight: "dark:text-sky-200",
        moodSelectBg: "bg-sky-50 dark:bg-sky-950/30",
        moodSelectBorder: "border-sky-500 dark:border-sky-500",
        moodSelectDarkBg: "dark:bg-sky-950/60",
        triggerSelectedBg: "bg-sky-600 dark:bg-sky-600",
        focusRing: "focus:ring-sky-500",
        btnBg: "bg-sky-600 hover:bg-sky-705",
        btnBgSec: "bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400",
        trendsReportBg: "bg-sky-605 text-white shadow-sky-100 dark:shadow-none",
        trendsReportText: "text-sky-100",
        title: "Aerospace Blue Theme",
        motivation: "Let systematic problem-solving progress, mental engineering clarity, and regular analytical breaks power your JEE journey."
      };
    case "NEET":
      return {
        key: "emerald",
        primaryText: "text-emerald-600 dark:text-emerald-450",
        primaryTextVibrant: "text-emerald-600 dark:text-emerald-400",
        bgLight_20: "bg-emerald-50/20 dark:bg-emerald-950/20",
        bgLight_30: "bg-emerald-50/30 dark:bg-emerald-950/30",
        borderActive: "border-emerald-600 dark:border-emerald-500",
        borderNormal: "border-emerald-200 dark:border-emerald-800",
        borderLight: "border-emerald-100/50 dark:border-emerald-900/40",
        badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
        badgeBgDark: "bg-emerald-100 dark:bg-emerald-950/80",
        badgeText: "text-emerald-600 dark:text-emerald-400",
        badgeTextAlt: "text-emerald-700 dark:text-emerald-305",
        iconHeroBg: "bg-emerald-600",
        shadowAccent: "shadow-emerald-100 dark:shadow-none",
        gradientFrom: "from-emerald-50/75 dark:from-slate-900",
        gradientTo: "to-teal-50/45 dark:to-slate-900/60",
        textGradientLight: "dark:text-emerald-200",
        moodSelectBg: "bg-emerald-50 dark:bg-emerald-950/30",
        moodSelectBorder: "border-emerald-500 dark:border-emerald-500",
        moodSelectDarkBg: "dark:bg-emerald-950/60",
        triggerSelectedBg: "bg-emerald-600 dark:bg-emerald-600",
        focusRing: "focus:ring-emerald-500",
        btnBg: "bg-emerald-600 hover:bg-emerald-705",
        btnBgSec: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
        trendsReportBg: "bg-emerald-605 text-white shadow-emerald-100 dark:shadow-none",
        trendsReportText: "text-emerald-100",
        title: "Healing Emerald Theme",
        motivation: "Align clinical memorization with deep diaphragmatic respiratory restoration, clean sleep schedules, and calm compassion."
      };
    case "UPSC":
      return {
        key: "amber",
        primaryText: "text-amber-600 dark:text-amber-450",
        primaryTextVibrant: "text-amber-600 dark:text-amber-400",
        bgLight_20: "bg-amber-50/20 dark:bg-amber-950/20",
        bgLight_30: "bg-amber-50/30 dark:bg-amber-950/30",
        borderActive: "border-amber-600 dark:border-amber-500",
        borderNormal: "border-amber-200 dark:border-amber-805",
        borderLight: "border-amber-100/50 dark:border-amber-900/40",
        badgeBg: "bg-amber-50 dark:bg-amber-950/40",
        badgeBgDark: "bg-amber-100 dark:bg-amber-950/80",
        badgeText: "text-amber-650 dark:text-amber-400",
        badgeTextAlt: "text-amber-700 dark:text-amber-305",
        iconHeroBg: "bg-amber-600",
        shadowAccent: "shadow-amber-100 dark:shadow-none",
        gradientFrom: "from-amber-55/15 dark:from-slate-900",
        gradientTo: "to-orange-50/45 dark:to-slate-900/60",
        textGradientLight: "dark:text-amber-200",
        moodSelectBg: "bg-amber-50 dark:bg-amber-950/30",
        moodSelectBorder: "border-amber-500 dark:border-amber-500",
        moodSelectDarkBg: "dark:bg-amber-950/60",
        triggerSelectedBg: "bg-amber-600 dark:bg-amber-600",
        focusRing: "focus:ring-amber-500",
        btnBg: "bg-amber-600 hover:bg-amber-705",
        btnBgSec: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
        trendsReportBg: "bg-amber-605 text-white shadow-amber-100 dark:shadow-none",
        trendsReportText: "text-amber-100",
        title: "Regal Gold Theme",
        motivation: "Endurance is the bedrock of civil service. Track trends objectively, balance reading targets, and guard your mental health."
      };
    case "Board Exams":
      return {
        key: "purple",
        primaryText: "text-purple-600 dark:text-purple-450",
        primaryTextVibrant: "text-purple-600 dark:text-purple-400",
        bgLight_20: "bg-purple-50/20 dark:bg-purple-950/20",
        bgLight_30: "bg-purple-50/30 dark:bg-purple-950/30",
        borderActive: "border-purple-600 dark:border-purple-500",
        borderNormal: "border-purple-200 dark:border-purple-800",
        borderLight: "border-purple-100/50 dark:border-purple-900/40",
        badgeBg: "bg-purple-50 dark:bg-purple-950/40",
        badgeBgDark: "bg-purple-100 dark:bg-purple-950/80",
        badgeText: "text-purple-600 dark:text-purple-400",
        badgeTextAlt: "text-purple-700 dark:text-purple-305",
        iconHeroBg: "bg-purple-600",
        shadowAccent: "shadow-purple-100 dark:shadow-none",
        gradientFrom: "from-purple-50/75 dark:from-slate-900",
        gradientTo: "to-indigo-50/45 dark:to-slate-900/60",
        textGradientLight: "dark:text-purple-200",
        moodSelectBg: "bg-purple-50 dark:bg-purple-950/30",
        moodSelectBorder: "border-purple-500 dark:border-purple-500",
        moodSelectDarkBg: "dark:bg-purple-950/60",
        triggerSelectedBg: "bg-purple-600 dark:bg-purple-600",
        focusRing: "focus:ring-purple-500",
        btnBg: "bg-purple-600 hover:bg-purple-705",
        btnBgSec: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
        trendsReportBg: "bg-purple-605 text-white shadow-purple-100 dark:shadow-none",
        trendsReportText: "text-purple-100",
        title: "Calming Amethyst Theme",
        motivation: "Decompress before exams. School percentages do not define your human worth. Pace syllabus targets with mini chai breaks."
      };
    case "CAT":
      return {
        key: "rose",
        primaryText: "text-rose-600 dark:text-rose-455",
        primaryTextVibrant: "text-rose-600 dark:text-rose-400",
        bgLight_20: "bg-rose-50/20 dark:bg-rose-950/20",
        bgLight_30: "bg-rose-50/30 dark:bg-rose-950/30",
        borderActive: "border-rose-600 dark:border-rose-500",
        borderNormal: "border-rose-200 dark:border-rose-800",
        borderLight: "border-rose-100/50 dark:border-rose-900/40",
        badgeBg: "bg-rose-50 dark:bg-rose-950/40",
        badgeBgDark: "bg-rose-100 dark:bg-rose-950/80",
        badgeText: "text-rose-600 dark:text-rose-400",
        badgeTextAlt: "text-rose-700 dark:text-rose-305",
        iconHeroBg: "bg-rose-600",
        shadowAccent: "shadow-rose-100 dark:shadow-none",
        gradientFrom: "from-rose-50/75 dark:from-slate-900",
        gradientTo: "to-pink-50/45 dark:to-slate-900/60",
        textGradientLight: "dark:text-rose-200",
        moodSelectBg: "bg-rose-50 dark:bg-rose-950/30",
        moodSelectBorder: "border-rose-500 dark:border-rose-500",
        moodSelectDarkBg: "dark:bg-rose-950/60",
        triggerSelectedBg: "bg-rose-600 dark:bg-rose-600",
        focusRing: "focus:ring-rose-500",
        btnBg: "bg-rose-600 hover:bg-rose-705",
        btnBgSec: "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400",
        trendsReportBg: "bg-rose-655 text-white shadow-rose-100 dark:shadow-none",
        trendsReportText: "text-rose-100",
        title: "Executive Rose Theme",
        motivation: "Approach analytical puzzles and quantitative logic with clean mental rhythm, high efficiency, and strategic interval rests."
      };
    case "GATE":
      return {
        key: "orange",
        primaryText: "text-orange-600 dark:text-orange-450",
        primaryTextVibrant: "text-orange-600 dark:text-orange-400",
        bgLight_20: "bg-orange-50/20 dark:bg-orange-950/20",
        bgLight_30: "bg-orange-50/30 dark:bg-orange-950/30",
        borderActive: "border-orange-600 dark:border-orange-500",
        borderNormal: "border-orange-200 dark:border-orange-850",
        borderLight: "border-orange-100/50 dark:border-orange-900/40",
        badgeBg: "bg-orange-50 dark:bg-orange-950/40",
        badgeBgDark: "bg-orange-100 dark:bg-orange-950/80",
        badgeText: "text-orange-600 dark:text-orange-400",
        badgeTextAlt: "text-orange-700 dark:text-orange-305",
        iconHeroBg: "bg-orange-600",
        shadowAccent: "shadow-orange-100 dark:shadow-none",
        gradientFrom: "from-orange-50/20 dark:from-slate-900",
        gradientTo: "to-amber-50/45 dark:to-slate-900/60",
        textGradientLight: "dark:text-orange-200",
        moodSelectBg: "bg-orange-50 dark:bg-orange-950/30",
        moodSelectBorder: "border-orange-500 dark:border-orange-500",
        moodSelectDarkBg: "dark:bg-orange-950/60",
        triggerSelectedBg: "bg-orange-600 dark:bg-orange-600",
        focusRing: "focus:ring-orange-500",
        btnBg: "bg-orange-600 hover:bg-orange-705",
        btnBgSec: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
        trendsReportBg: "bg-orange-600 text-white shadow-orange-100 dark:shadow-none",
        trendsReportText: "text-orange-100",
        title: "Industrial Amber Theme",
        motivation: "Conquer advanced engineering fundamentals with solid structured sprints, deep hydration, and stress prevention checks."
      };
    case "CUET":
      return {
        key: "teal",
        primaryText: "text-teal-600 dark:text-teal-450",
        primaryTextVibrant: "text-teal-600 dark:text-teal-400",
        bgLight_20: "bg-teal-50/20 dark:bg-teal-950/20",
        bgLight_30: "bg-teal-50/30 dark:bg-teal-950/30",
        borderActive: "border-teal-600 dark:border-teal-500",
        borderNormal: "border-teal-200 dark:border-teal-800",
        borderLight: "border-teal-100/50 dark:border-teal-900/40",
        badgeBg: "bg-teal-50 dark:bg-teal-950/40",
        badgeBgDark: "bg-teal-100 dark:bg-teal-950/80",
        badgeText: "text-teal-600 dark:text-teal-400",
        badgeTextAlt: "text-teal-700 dark:text-teal-305",
        iconHeroBg: "bg-teal-600",
        shadowAccent: "shadow-teal-100 dark:shadow-none",
        gradientFrom: "from-teal-50/75 dark:from-slate-900",
        gradientTo: "to-emerald-50/45 dark:to-slate-900/60",
        textGradientLight: "dark:text-teal-200",
        moodSelectBg: "bg-teal-50 dark:bg-teal-950/30",
        moodSelectBorder: "border-teal-500 dark:border-teal-500",
        moodSelectDarkBg: "dark:bg-teal-950/60",
        triggerSelectedBg: "bg-teal-600 dark:bg-teal-600",
        focusRing: "focus:ring-teal-500",
        btnBg: "bg-teal-600 hover:bg-teal-705",
        btnBgSec: "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400",
        trendsReportBg: "bg-teal-600 text-white shadow-teal-100 dark:shadow-none",
        trendsReportText: "text-teal-100",
        title: "Fresh Mint Theme",
        motivation: "Welcome undergraduate entry with positivity, flexible learning schemas, and structured mindfulness habits."
      };
    default:
      return {
        key: "indigo",
        primaryText: "text-indigo-600 dark:text-indigo-450",
        primaryTextVibrant: "text-indigo-600 dark:text-indigo-400",
        bgLight_20: "bg-indigo-50/20 dark:bg-indigo-950/20",
        bgLight_30: "bg-indigo-50/30 dark:bg-indigo-950/30",
        borderActive: "border-indigo-600 dark:border-indigo-500",
        borderNormal: "border-slate-100 dark:border-slate-800",
        borderLight: "border-indigo-100/50 dark:border-indigo-900/40",
        badgeBg: "bg-indigo-50 dark:bg-indigo-950/40",
        badgeBgDark: "bg-indigo-100 dark:bg-indigo-950/80",
        badgeText: "text-indigo-600 dark:text-indigo-400",
        badgeTextAlt: "text-indigo-700 dark:text-indigo-305",
        iconHeroBg: "bg-indigo-600",
        shadowAccent: "shadow-indigo-100 dark:shadow-none",
        gradientFrom: "from-indigo-50/75 dark:from-slate-900",
        gradientTo: "to-purple-50/75 dark:to-slate-900/60",
        textGradientLight: "dark:text-indigo-200",
        moodSelectBg: "bg-indigo-50 dark:bg-indigo-950/30",
        moodSelectBorder: "border-indigo-500 dark:border-indigo-500",
        moodSelectDarkBg: "dark:bg-indigo-950/60",
        triggerSelectedBg: "bg-indigo-600 dark:bg-indigo-600",
        focusRing: "focus:ring-indigo-500",
        btnBg: "bg-indigo-600 hover:bg-indigo-700",
        btnBgSec: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
        trendsReportBg: "bg-indigo-600 text-white shadow-indigo-100 dark:shadow-none",
        trendsReportText: "text-indigo-100",
        title: "Deep Indigo Theme",
        motivation: "Let self-care support your study flow. Academic outcomes do not measure your inner value as a human being."
      };
  }
}
