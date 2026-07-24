import { FinnhubClient } from "./finnhub";
import type { EarningsCalendarItem, IpoCalendarItem } from "./types";

export interface CalendarData {
  earnings: EarningsCalendarItem[];
  ipos: IpoCalendarItem[];
  isConfigured: boolean;
}

/**
 * Finnhub's macro economic calendar (/calendar/economic — CPI, FOMC, NFP, GDP)
 * requires a premium plan and returns 403 on the free/basic tier used here.
 * Earnings and IPO calendars ARE accessible on this tier and are real,
 * forward-looking scheduled events, so this surfaces those honestly instead
 * of fabricating macro event data we cannot source.
 */
export async function getCalendarData(from: string, to: string): Promise<CalendarData> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return { earnings: [], ipos: [], isConfigured: false };
  }

  const client = new FinnhubClient(apiKey);
  const [earnings, ipos] = await Promise.all([
    client.getEarningsCalendar(from, to).catch((error) => {
      console.warn("Failed to fetch earnings calendar:", error);
      return [];
    }),
    client.getIpoCalendar(from, to).catch((error) => {
      console.warn("Failed to fetch IPO calendar:", error);
      return [];
    }),
  ]);

  earnings.sort((a, b) => a.date.localeCompare(b.date));
  ipos.sort((a, b) => a.date.localeCompare(b.date));

  return { earnings, ipos, isConfigured: true };
}
