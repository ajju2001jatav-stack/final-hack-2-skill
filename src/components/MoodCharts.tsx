/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";
import { MoodLog } from "../types";
import { AlertCircle, Calendar, TrendingUp, BarChart2, Activity } from "lucide-react";

interface MoodChartsProps {
  logs: MoodLog[];
}

export default function MoodCharts({ logs }: MoodChartsProps) {
  // Sorted logs
  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => a.timestamp - b.timestamp);
  }, [logs]);

  // Helper to get formatted date string for display (e.g., June 5)
  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
    } catch (e) {}
    return dateStr;
  };

  // 1. Last 7 Days Trend Calculations
  const last7DaysLogs = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return sortedLogs.filter((log) => log.timestamp >= cutoff).slice(-7);
  }, [sortedLogs]);



  // Graph Width and Height configuration for custom drawing
  const svgW = 500;
  const svgH = 180;
  const paddingX = 40;
  const paddingY = 20;

  const renderTrendLine = (targetLogs: MoodLog[]) => {
    if (targetLogs.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-12">
          <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs font-medium">Log your mood to generate trend data</span>
        </div>
      );
    }

    const maxItems = targetLogs.length;
    const points: string[] = [];

    // Calculate dynamic coordinates
    targetLogs.forEach((log, index) => {
      const x = paddingX + (index / Math.max(1, maxItems - 1)) * (svgW - 2 * paddingX);
      // Mood is 1 to 5, invert it so 5 (Great) is at the top (smaller Y)
      const normalizedMood = (log.mood - 1) / 4; // 0 to 1
      const y = svgH - paddingY - normalizedMood * (svgH - 2 * paddingY);
      points.push(`${x},${y}`);
    });

    const isPathFilled = points.length > 1;

    return (
      <div className="w-full">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible">
          {/* Grid lines (1 to 5) */}
          {[1, 2, 3, 4, 5].map((yVal) => {
            const normalizedY = (yVal - 1) / 4;
            const gridY = svgH - paddingY - normalizedY * (svgH - 2 * paddingY);
            return (
              <g key={yVal}>
                <line
                  x1={paddingX}
                  y1={gridY}
                  x2={svgW - paddingX}
                  y2={gridY}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={gridY + 4}
                  className="text-[10px] font-semibold fill-slate-400 dark:fill-slate-500 text-right"
                  textAnchor="end"
                >
                  {yVal === 5 ? "Great" : yVal === 1 ? "Low" : yVal}
                </text>
              </g>
            );
          })}

          {/* Line and shadow area */}
          {isPathFilled && (
            <>
              {/* Fill area beneath the trend line */}
              <path
                d={`M ${paddingX},${svgH - paddingY} L ${points.join(" L ")} L ${
                  paddingX + (points.length - 1) / Math.max(1, points.length - 1) * (svgW - 2 * paddingX)
                },${svgH - paddingY} Z`}
                className="fill-indigo-50/30 dark:fill-indigo-950/10"
              />
              {/* Main stroke line */}
              <path
                d={`M ${points.join(" L ")}`}
                className="stroke-indigo-500 dark:stroke-indigo-400"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Individual Data Points */}
          {targetLogs.map((log, index) => {
            const x = paddingX + (index / Math.max(1, maxItems - 1)) * (svgW - 2 * paddingX);
            const normalizedMood = (log.mood - 1) / 4;
            const y = svgH - paddingY - normalizedMood * (svgH - 2 * paddingY);

            const emojis = ["😢", "😰", "😐", "🙂", "✨"];
            const emoji = emojis[log.mood - 1] || "😐";

            return (
              <g key={log.id} className="group cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  className="fill-white stroke-indigo-600 dark:fill-slate-900 dark:stroke-indigo-400"
                  strokeWidth="3"
                />
                {/* Tooltip on Hover */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <rect
                    x={x - 45}
                    y={y - 36}
                    width="90"
                    height="24"
                    rx="6"
                    className="fill-slate-900/90 dark:fill-slate-100/90 shadow-lg"
                  />
                  <text
                    x={x}
                    y={y - 20}
                    className="text-[9px] font-bold fill-white dark:fill-slate-900 text-center"
                    textAnchor="middle"
                  >
                    {emoji} {formatDateLabel(log.date)}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Date Labels below the chart */}
          {targetLogs.map((log, index) => {
            const x = paddingX + (index / Math.max(1, maxItems - 1)) * (svgW - 2 * paddingX);
            return (
              <text
                key={log.id}
                x={x}
                y={svgH - 4}
                className="text-[9px] font-medium fill-slate-500 dark:fill-slate-400"
                textAnchor="middle"
              >
                {formatDateLabel(log.date)}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  // 3. Top Triggers Aggregation
  const triggerStats = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((log) => {
      if (Array.isArray(log.triggers)) {
        log.triggers.forEach((trigger) => {
          counts[trigger] = (counts[trigger] || 0) + 1;
        });
      }
    });

    const items = Object.entries(counts).map(([name, count]) => ({ name, count }));
    return items.sort((a, b) => b.count - a.count).slice(0, 5);
  }, [logs]);

  // 4. Heatmap showing recurring triggers over last 30 days
  // Let's create an array representing the last 30 days
  const last30DaysHeatmap = useMemo(() => {
    const result = [];
    const oneDayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * oneDayMs);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const logsOnDay = logs.filter((log) => log.date === dateKey);
      const intensity = logsOnDay.reduce((acc, current) => acc + (current.triggers?.length || 0), 0);
      const moodValue = logsOnDay.length > 0 ? logsOnDay[0].mood : null;

      result.push({
        date: dateKey,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        intensity, // concentration of stress triggers
        moodValue,
      });
    }
    return result;
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* 7-Day & 30-Day Trend Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">7-Day Mood Trend</h4>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full">
              Weekly Rhythm
            </span>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100/60 dark:border-slate-800">
            {renderTrendLine(last7DaysLogs)}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-indigo-500" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">30-Day Mood Trend</h4>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full">
              Monthly Pulse
            </span>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100/60 dark:border-slate-800">
            {renderTrendLine(last30DaysHeatmap.map(day => {
              // Extract log entries if logged, otherwise fallback to construct continuous trend line representation
              const logsOnThisDate = logs.filter(l => l.date === day.date);
              return logsOnThisDate.length > 0 
                ? logsOnThisDate[0] 
                : { id: day.date, date: day.date, timestamp: new Date(day.date).getTime(), mood: 3, triggers: [], reflection: { todayHard: "", todayWell: "", tomorrowWill: "" } } as MoodLog;
            }).filter(i => logs.some(loggedItem => loggedItem.date === i.date)))}
            {logs.length < 2 && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2">
                Need at least 2 logged days to draw a 30-day timeline.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Triggers and heatmap distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Section */}
        <div className="lg:col-span-7 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-indigo-500" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">30-Day Stress Trigger Heatmap</h4>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-500 rounded-xs inline-block"></span> High Stress concentration
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xl">
            Somatic pattern tracker: Darker blocks indicate days with high trigger concentrations (syllabus overload, family expectations, etc.). Hover over boxes to see details.
          </p>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2.5 py-2">
            {last30DaysHeatmap.map((day) => {
              // Color mapping based on trigger count (intensity)
              let colorClass = "bg-slate-100 dark:bg-slate-800 hover:border-slate-300";
              if (day.intensity > 0) {
                if (day.intensity <= 1) {
                  colorClass = "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-900/40";
                } else if (day.intensity <= 3) {
                  colorClass = "bg-indigo-300 text-indigo-950 dark:bg-indigo-800/80 dark:text-white border-indigo-400";
                } else {
                  colorClass = "bg-indigo-600 text-white dark:bg-indigo-500 border-indigo-700 animate-pulse";
                }
              }

              return (
                <div
                  key={day.date}
                  id={`heatmap-cell-${day.date}`}
                  className={`aspect-square p-1 border rounded-lg flex flex-col justify-between cursor-help transition-all relative group ${colorClass}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Heatmap cell for ${day.label}: ${day.intensity} stressors logged${day.moodValue ? `, mood rating: ${day.moodValue}/5` : ""}`}
                >
                  <span className="text-[8px] font-bold opacity-60 leading-none">
                    {day.date.split("-")[2]}
                  </span>
                  
                  {day.intensity > 0 ? (
                    <span className="text-[10px] font-extrabold text-center mx-auto block leading-none">
                      {day.intensity}
                    </span>
                  ) : (
                    <span className="text-[8px] font-medium text-center mx-auto block leading-none opacity-30">
                      •
                    </span>
                  )}

                  {/* Heatmap Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 pointer-events-none group-hover:opacity-100 bg-slate-900 text-white text-[9px] p-2 rounded-lg shadow-lg z-20 w-28 text-center transition-all">
                    <p className="font-semibold">{day.label}</p>
                    <p className="mt-0.5">{day.intensity} Stressors logged</p>
                    {day.moodValue && <p className="text-[8px] italic opacity-80">Mood rating: {day.moodValue}/5</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top stress factors counts */}
        <div className="lg:col-span-5 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-4.5 h-4.5 text-indigo-500" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Top Recurring Triggers</h4>
            </div>
          </div>

          {triggerStats.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-12 text-center">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs font-semibold">No stressors logged yet</span>
              <p className="text-[10px] opacity-70 mt-1 max-w-[200px]">Triggers logged in your check-in will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {triggerStats.map((item, index) => {
                const totalTriggers = logs.reduce((sum, log) => sum + (log.triggers?.length || 0), 0);
                const percentage = totalTriggers > 0 ? Math.round((item.count / totalTriggers) * 100) : 0;

                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {index + 1}. {item.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {item.count} times ({percentage}%)
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-indigo-500 dark:bg-indigo-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(8, percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
