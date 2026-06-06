/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Trash2, ArrowUpRight, Loader } from "lucide-react";
import { ChatMessage } from "../types";

interface AIWellnessChatProps {
  currentExam: string;
}

const CHIP_SUGGESTIONS = [
  "JEE mock test scores are making me highly anxious",
  "NEET/UPSC syllabus is overwhelming. Tips to manage?",
  "How to deal with family expectations during prep?",
  "Give me a quick 5-min mental decompression routine",
];

export default function AIWellnessChat({ currentExam }: AIWellnessChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Initialize with a friendly greeting tailored to their choice of exam
  useEffect(() => {
    const examLabel = currentExam && currentExam !== "Other" ? currentExam : "your competitive exams";
    setMessages([
      {
        id: "greet",
        role: "assistant",
        content: `**Namaste! I am MindSpace, your wellness mentor.** ✨
        
I am here to support you through the intense pressure of preparing for ${examLabel}. Whether you are struggling under syllabus overload, worrying about mock test scores, dealing with peer/family expectations, or just need a safe, judgment-free space to speak—I'm here.

How can I help you decompress today? Feel free to try any of the suggestions below.`,
        timestamp: Date.now(),
      }
    ]);
  }, [currentExam]);

  // Handle scrolling to latest messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorText(null);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message along with history (only last 10 messages to save request volume)
      const historyContext = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyContext,
        }),
      });

      if (!res.ok) {
        throw new Error("Could not convey message safely. Please verify server state.");
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "I am reflecting on this. Please try again.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorText("Oops, server connection failed. Make sure you are online or try reloading the tab!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Do you want to reset your conversation history? All private context will be refreshed.")) {
      const examLabel = currentExam && currentExam !== "Other" ? currentExam : "your competitive exams";
      setMessages([
        {
          id: "greet-re",
          role: "assistant",
          content: `**MindSpace refreshed.** 🌱
          
I have cleared the conversation. Speak freely—what's on your mind? How can we tackle ${examLabel} fatigue today?`,
          timestamp: Date.now(),
        }
      ]);
    }
  };

  // Safe manual parsing of basic format markers like bold (**text**) and bullet points (* point)
  // to prevent potential cross-site-scripting or complex react-markdown issues
  const renderFormattedMessage = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, lineIndex) => {
      // Check if it represents a header/bullet representation
      let cleanLine = line.trim();
      
      // If empty line, render a small space
      if (!cleanLine) {
        return <div key={lineIndex} className="h-2"></div>;
      }

      // Check if line represents professional helpline alerts (Vandrevala / iCall) to box them out safely
      const isHelpline = cleanLine.includes("iCall") || cleanLine.includes("Vandrevala") || cleanLine.includes("9152987821") || cleanLine.includes("9999666555") || cleanLine.includes("AASRA");

      // Replace bold markers **text** with rich elements
      const renderTextWithBolds = (textStr: string) => {
        const parts = textStr.split(/\*\*([\s\S]*?)\*\*/g);
        return parts.map((part, i) => {
          if (i % 2 === 1) {
            return <strong key={i} className="font-extrabold text-blue-900 dark:text-teal-200">{part}</strong>;
          }
          return part;
        });
      };

      if (cleanLine.startsWith("* ") || cleanLine.startsWith("- ")) {
        const textOnly = cleanLine.replace(/^[\*\-]\s+/, "");
        return (
          <li key={lineIndex} className="ml-5 list-disc text-sm py-1 font-medium transition-all text-slate-700 dark:text-slate-300">
            {renderTextWithBolds(textOnly)}
          </li>
        );
      }

      // Check for numeric listing
      const numMatch = cleanLine.match(/^\d+\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={lineIndex} className="ml-5 flex gap-2 text-sm py-1 font-medium transition-all text-slate-700 dark:text-slate-300">
            <span className="font-bold text-indigo-500">{cleanLine.split(".")[0]}.</span>
            <span>{renderTextWithBolds(numMatch[1])}</span>
          </div>
        );
      }

      // Format helpline highlight prominently
      if (isHelpline) {
        return (
          <div key={lineIndex} className="my-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs font-semibold text-rose-800 dark:text-rose-300 shadow-xs flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 flex-shrink-0 animate-ping"></div>
            <div>{renderTextWithBolds(cleanLine)}</div>
          </div>
        );
      }

      return (
        <p key={lineIndex} className="text-sm font-medium leading-relaxed my-1 text-slate-700 dark:text-slate-300">
          {renderTextWithBolds(cleanLine)}
        </p>
      );
    });
  };

  return (
    <div id="ai-chat-module" className="flex flex-col h-[520px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden transition-all shadow-xs">
      {/* Chat header */}
      <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl animate-pulse">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
              MindSpace AI Companion
            </h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Secured Private Sandbox (Free & Confidential)
            </p>
          </div>
        </div>

        <button
          id="clear-chat-btn"
          onClick={handleClear}
          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all"
          title="Clear Conversation"
          aria-label="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 bg-indigo-50/50 dark:bg-slate-800/10 border-b border-indigo-100/25 dark:border-slate-800">
        <span className="text-[9px] uppercase tracking-wider font-semibold text-indigo-600/75 dark:text-indigo-400 block mb-1">
          Quick queries to ask
        </span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CHIP_SUGGESTIONS.map((chip, index) => (
            <button
              key={index}
              id={`query-chip-${index}`}
              onClick={() => handleSendMessage(chip)}
              className="text-[11px] font-semibold text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-350 hover:bg-indigo-500 hover:text-white border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1 flex items-center gap-1 cursor-pointer transition-all flex-shrink-0"
            >
              <span>{chip}</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages body */}
      <div 
        ref={scrollRef}
        className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-slate-900/10"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 border transition-all ${
                msg.role === "user"
                  ? "bg-slate-900 border-transparent text-white dark:bg-slate-800 dark:text-slate-200 rounded-tr-xs"
                  : "bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded-tl-xs shadow-xs"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] opacity-60 uppercase font-semibold">
                {msg.role === "user" ? "You" : "MindSpace AI Mentor"}
                <span className="text-[8px]">•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              
              <div className="space-y-1">
                {msg.role === "user" ? (
                  <p className="text-sm font-medium">{msg.content}</p>
                ) : (
                  renderFormattedMessage(msg.content)
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-800 rounded-2xl rounded-tl-xs p-4 flex items-center gap-3 shadow-xs">
              <Loader className="w-4 h-4 text-indigo-500 animate-spin" />
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Reflecting on Indian student experiences...
              </span>
            </div>
          </div>
        )}

        {errorText && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 text-center">
            {errorText}
          </div>
        )}
      </div>

      {/* Input container */}
      <form
        id="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3.5 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 items-center"
      >
        <input
          id="chat-message-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything (e.g. 'How to study 6 hours without mental fatigue?')..."
          maxLength={300}
          disabled={isLoading}
          className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 dark:text-slate-200"
        />
        <button
          id="chat-submit-btn"
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
}
