// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "../App";

describe("App Component", () => {
  it("renders the MindSpace dashboard, switches tabs, and manages configurations", () => {
    const { container } = render(<App />);

    // 1. Initial Dashboard Verification
    expect(screen.getAllByText("MindSpace").length).toBeGreaterThan(0);
    expect(screen.getByText("Daily Check-In")).toBeDefined();
    expect(screen.getByText("AI Companion")).toBeDefined();
    expect(screen.getByText("Study Timer & Breathing")).toBeDefined();
    expect(screen.getByText("Progress Analytica")).toBeDefined();
    expect(screen.getByText("Secure Backup")).toBeDefined();

    // 2. Tab Navigation Interaction Verification
    const timersTab = container.querySelector("#tab-btn-timers") as HTMLButtonElement;
    expect(timersTab).not.toBeNull();

    // Switch to Timers tab
    fireEvent.click(timersTab);

    // Verify Breathing space and Pomodoro timer widgets render
    expect(screen.getByText("Breathing Space")).toBeDefined();
    expect(screen.getByText("Exam Study Timer")).toBeDefined();

    // Switch to Secure Backup (settings) tab
    const settingsTab = container.querySelector("#tab-btn-settings") as HTMLButtonElement;
    expect(settingsTab).not.toBeNull();
    fireEvent.click(settingsTab);

    expect(screen.getByText("Secure Cloud Synchronization")).toBeDefined();
    expect(screen.getByText("Load Backup")).toBeDefined();
  });
});
