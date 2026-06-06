// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";
import PomodoroTimer from "../components/PomodoroTimer";

describe("PomodoroTimer Component", () => {
  it("verifies rendering, preset selection, and start/pause toggle", () => {
    const { container } = render(<PomodoroTimer />);

    // 1. Initial Render Verification
    expect(screen.getByText("Exam Study Timer")).toBeDefined();
    expect(screen.getByText("Pace your learning sprints and build brain endurance")).toBeDefined();

    // 2. Preset Selection Verification
    const breakPresetBtn = container.querySelector("#preset-btn-short-recovery-break") as HTMLButtonElement;
    expect(breakPresetBtn).not.toBeNull();
    fireEvent.click(breakPresetBtn);
    
    // Check that duration changes (e.g. showing "05:00" for the 5-min break)
    expect(screen.getByText("05:00")).toBeDefined();

    // 3. Start/Pause Toggle Verification
    const toggleBtn = container.querySelector("#pomodoro-toggle-btn") as HTMLButtonElement;
    expect(toggleBtn).not.toBeNull();
    expect(toggleBtn.textContent).toContain("Start");

    // Click Start
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toContain("Pause");

    // Click Pause
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toContain("Start");

    // 4. Reset Button Verification
    const resetBtn = container.querySelector("#pomodoro-reset-btn") as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();
    fireEvent.click(resetBtn);
  });
});
