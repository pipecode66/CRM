"use client";

import { SessionProvider } from "next-auth/react";

import { RealtimeProvider } from "@/components/providers/realtime-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RealtimeProvider>{children}</RealtimeProvider>
    </SessionProvider>
  );
}

