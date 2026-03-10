"use client";

import { createContext, useContext, useMemo, useState } from "react";

type RealtimeEvent = {
  type: string;
  payload: Record<string, unknown>;
};

type RealtimeContextValue = {
  events: RealtimeEvent[];
  push: (event: RealtimeEvent) => void;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);

  const value = useMemo<RealtimeContextValue>(
    () => ({
      events,
      push: (event) => {
        setEvents((previous) => [event, ...previous].slice(0, 100));
      },
    }),
    [events],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtimeEvents() {
  const context = useContext(RealtimeContext);

  if (!context) {
    throw new Error("useRealtimeEvents must be used inside RealtimeProvider");
  }

  return context;
}
