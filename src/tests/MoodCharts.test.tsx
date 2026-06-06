// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MoodCharts from "../components/MoodCharts";
import { MoodLog } from "../types";

// Create mock logs for testing
const mockLogs: MoodLog[] = [
  {
    id: "2026-06-05",
    date: "2026-06-05",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    mood: 4,
    triggers: ["Syllabus Overload"],
    reflection: { todayHard: "", todayWell: "", tomorrowWill: "" }
  },
  {
    id: "2026-06-06",
    date: "2026-06-06",
    timestamp: Date.now(),
    mood: 5,
    triggers: ["Sleep Deprivation"],
    reflection: { todayHard: "", todayWell: "", tomorrowWill: "" }
  }
];

describe("MoodCharts Component", () => {
  it("renders mood trends charts, triggers, and stress heatmap details", () => {
    const { container } = render(<MoodCharts logs={mockLogs} />);

    // 1. Check title headers
    expect(screen.getByText("7-Day Mood Trend")).toBeDefined();
    expect(screen.getByText("30-Day Mood Trend")).toBeDefined();
    expect(screen.getByText("30-Day Stress Trigger Heatmap")).toBeDefined();
    expect(screen.getByText("Top Recurring Triggers")).toBeDefined();

    // 2. Check that the heatmap renders cells
    const cellElement = container.querySelector("#heatmap-cell-2026-06-06");
    expect(cellElement).not.toBeNull();

    // 3. Verify top triggers displays text (use getAllByText to handle multiple occurrences)
    expect(screen.getAllByText(/Syllabus Overload/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sleep Deprivation/i).length).toBeGreaterThan(0);
  });
});
