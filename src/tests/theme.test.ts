import { describe, it, expect } from "vitest";
import { getExamTheme } from "../utils/theme";

describe("getExamTheme", () => {
  it("should return the correct theme configuration for JEE", () => {
    const theme = getExamTheme("JEE");
    expect(theme.key).toBe("sky");
    expect(theme.title).toBe("Aerospace Blue Theme");
    expect(theme.motivation).toContain("JEE journey");
  });

  it("should return the correct theme configuration for NEET", () => {
    const theme = getExamTheme("NEET");
    expect(theme.key).toBe("emerald");
    expect(theme.title).toBe("Healing Emerald Theme");
  });

  it("should return the correct theme configuration for UPSC", () => {
    const theme = getExamTheme("UPSC");
    expect(theme.key).toBe("amber");
    expect(theme.title).toBe("Regal Gold Theme");
  });

  it("should return the correct theme configuration for Board Exams", () => {
    const theme = getExamTheme("Board Exams");
    expect(theme.key).toBe("purple");
    expect(theme.title).toBe("Calming Amethyst Theme");
  });

  it("should fall back to Indigo theme for unrecognized exams or empty config", () => {
    const theme = getExamTheme("UnknownExam");
    expect(theme.key).toBe("indigo");
    expect(theme.title).toBe("Deep Indigo Theme");
  });
});
