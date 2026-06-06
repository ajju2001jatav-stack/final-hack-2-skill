// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import BreathingExercise from "../components/BreathingExercise";

describe("BreathingExercise Component", () => {
  it("verifies rendering, pattern selection, and start/stop toggling", () => {
    const { container } = render(<BreathingExercise />);
    
    // 1. Initial Render Verification
    const title = container.querySelector("h3");
    expect(title?.textContent).toBe("Breathing Space");
    expect(screen.getByText("Quiet your mind and relieve academic fatigue")).toBeDefined();

    // 2. Pattern Selection Verification
    const boxBtn = container.querySelector("#pattern-btn-box-breathing") as HTMLButtonElement;
    expect(boxBtn).not.toBeNull();
    fireEvent.click(boxBtn);
    expect(screen.getByText("Resets the nervous system. Inhale, hold, exhale, hold—each for 4s.")).toBeDefined();

    // 3. Start/Stop Toggle Verification
    const toggleBtn = container.querySelector("#breathing-toggle-btn") as HTMLButtonElement;
    expect(toggleBtn).not.toBeNull();
    expect(toggleBtn.textContent).toContain("Start Exercise");

    // Click Start
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toContain("Stop Exercise");
    expect(screen.getByText("Breathe In Slowly")).toBeDefined();

    // Click Stop
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toContain("Start Exercise");
  });
});
