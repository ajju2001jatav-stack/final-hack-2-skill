/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MoodLog } from "../types";

/**
 * Calculates the current daily consistency streak of self-reflection checkins.
 * Returns the consecutive number of days leading up to today or yesterday.
 * 
 * @param logsList Array of mood logs containing ISO dates (YYYY-MM-DD)
 */
export function calculateStreak(logsList: MoodLog[]): number {
  if (!logsList || logsList.length === 0) return 0;
  
  // Extract unique sorted check-in dates
  const dates = Array.from(new Set(logsList.map(l => l.date))).sort();
  if (dates.length === 0) return 0;
  
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  
  const latestDate = dates[dates.length - 1];
  
  // Break early if the latest reflection day is older than yesterday
  if (latestDate !== todayStr && latestDate !== yesterdayStr) {
    return 0;
  }
  
  let streak = 0;
  const currentCheckDate = new Date(latestDate);
  
  // Backtrace one calendar day at a time
  while (true) {
    const year = currentCheckDate.getFullYear();
    const month = String(currentCheckDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentCheckDate.getDate()).padStart(2, "0");
    const checkDateStr = `${year}-${month}-${day}`;
    
    if (dates.includes(checkDateStr)) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}
