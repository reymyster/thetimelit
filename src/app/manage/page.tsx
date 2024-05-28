"use client";

import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";

export default function Page() {
  const { status, data } = trpc.public.quotes.getAllBasic.useQuery();

  if (status === "pending") return <div>Loading...</div>;

  return (
    <main className="flex flex-grow flex-col items-center justify-center">
      <div className="mx-4 border border-background/50 bg-background/50 p-4 text-foreground shadow-xl backdrop-blur-sm">
        <table className="border-collapse border border-background/80">
          <thead>
            <tr>
              <th className="border border-background/80 p-2 text-left">
                Quote
              </th>
              <th className="border border-background/80 p-2 text-left">
                Mark Up
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((quote) => (
              <tr key={quote.id}>
                <td className="max-w-[75svw] truncate border border-background/70 p-2">
                  {quote.text}
                </td>
                <td className="border border-background/70 p-2">link</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
