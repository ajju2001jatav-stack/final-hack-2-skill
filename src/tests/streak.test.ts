import { describe, it, expect } from "vitest";
import { calculateStreak } from "../utils/streak";
import { MoodLog } from "../types";

// Helper to create a MoodLog with specific relative day offset
function createMockLog(dayOffset: number): MoodLog {
  const dateObj = new Date(Date.now() + dayOffset * 24 * 60 * 60 * 1000);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;
  
  return {
    id: dateStr,
    date: dateStr,
    timestamp: dateObj.getTime(),
    mood: 4,
    triggers: [],
    reflection: {
      todayHard: "",
      todayWell: "",
      tomorrowWill: ""
    }
  };
}

describe("calculateStreak", () => {
  it("should return 0 when logs list is empty or undefined", () => {
    expect(calculateStreak([])).toBe(0);
    expect(calculateStreak(null as any)).toBe(0);
  });

  it("should return 1 when there is only a log for today", () => {
    const logs = [createMockLog(0)];
    expect(calculateStreak(logs)).toBe(1);
  });

  it("should return 1 when there is only a log for yesterday", () => {
    const logs = [createMockLog(-1)];
    expect(calculateStreak(logs)).toBe(1);
  });

  it("should return 2 when logs exist for both today and yesterday", () => {
    const logs = [createMockLog(-1), createMockLog(0)];
    expect(calculateStreak(logs)).toBe(2);
  });

  it("should return 3 for today, yesterday, and 2 days ago", () => {
    const logs = [createMockLog(-2), createMockLog(-1), createMockLog(0)];
    expect(calculateStreak(logs)).toBe(3);
  });

  it("should handle duplicate entries for the same day", () => {
    const todayLog1 = createMockLog(0);
    const todayLog2 = { ...todayLog1, id: "dup", timestamp: todayLog1.timestamp + 1000 };
    const logs = [createMockLog(-1), todayLog1, todayLog2];
    expect(calculateStreak(logs)).toBe(2);
  });

  it("should break the streak when there is a gap of a day", () => {
    // Gap on yesterday (-1)
    const logs = [createMockLog(-3), createMockLog(-2), createMockLog(0)];
    expect(calculateStreak(logs)).toBe(1);
  });

  it("should return 0 when the latest log is from 2 days ago or older", () => {
    const logs = [createMockLog(-3), createMockLog(-2)];
    expect(calculateStreak(logs)).toBe(0);
  });
});
