"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";

import { trpc } from "./client";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // browser should use relative path
    return "";
  }

  if (process.env.VERCEL_URL) {
    // for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const MINUTE = 60 * 1000;

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            gcTime: 120 * MINUTE,
            staleTime: 60 * MINUTE,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: SuperJSON,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
