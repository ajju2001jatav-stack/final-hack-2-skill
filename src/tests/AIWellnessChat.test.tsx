// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import AIWellnessChat from "../components/AIWellnessChat";

describe("AIWellnessChat Component", () => {
  beforeEach(() => {
    // Mock global fetch for chat endpoint
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ text: "I am a helpful AI Wellness Assistant." }),
      } as any)
    );
  });

  it("renders the chat sandbox interface and handles messages", async () => {
    const { container } = render(<AIWellnessChat currentExam="JEE" />);

    // 1. Initial UI Render Verification
    expect(screen.getByText("MindSpace AI Companion")).toBeDefined();
    expect(screen.getByText(/Secured Private Sandbox/i)).toBeDefined();

    // Verify greeting matches JEE exam theme
    expect(screen.getByText(/support you through the intense pressure of preparing for JEE/i)).toBeDefined();

    // Verify chips render
    expect(screen.getByText("JEE mock test scores are making me highly anxious")).toBeDefined();

    // 2. Mocking user text typing and sending
    const textInput = container.querySelector("#chat-message-input") as HTMLInputElement;
    expect(textInput).not.toBeNull();
    
    // Type message
    fireEvent.change(textInput, { target: { value: "I feel tired of studying physics formulas." } });
    expect(textInput.value).toBe("I feel tired of studying physics formulas.");

    // Click submit
    const submitBtn = container.querySelector("#chat-submit-btn") as HTMLButtonElement;
    expect(submitBtn).not.toBeNull();
    fireEvent.click(submitBtn);

    // Verify input clears
    expect(textInput.value).toBe("");

    // Verify message appears in messages list
    expect(screen.getByText("I feel tired of studying physics formulas.")).toBeDefined();

    // 3. Clear Chat trigger verification
    const clearBtn = container.querySelector("#clear-chat-btn") as HTMLButtonElement;
    expect(clearBtn).not.toBeNull();

    // Mock confirm dialog
    vi.spyOn(window, "confirm").mockImplementation(() => true);
    fireEvent.click(clearBtn);

    // Verify display shows fresh welcome greeting
    expect(screen.getByText("MindSpace refreshed.")).toBeDefined();
  });
});
