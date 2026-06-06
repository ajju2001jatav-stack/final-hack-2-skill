/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  mood: MoodValue;
  journal?: string;
  triggers: string[]; // syllabus pressure, peer comparison, etc.
  reflection: {
    todayHard: string;
    todayWell: string;
    tomorrowWill: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface WellnessConfig {
  targetExam: string; // JEE, NEET, UPSC, Board, GATE, CAT, CUET, Other
  syncKey: string;
  lastSyncTime?: number;
}
