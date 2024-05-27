"use client";

import { trpc } from "@/app/_trpc/client";
import { useDateResetsEvery } from "@/lib/dates/hooks";

export default function Page() {
  const now = useDateResetsEvery("minute");
  const { status, data } = trpc.hi.useQuery({ date: now });

  console.log({
    now,
    offset: now.getTimezoneOffset(),
    status,
    data,
    d: now.toLocaleTimeString(),
    u: now.toUTCString(),
  });
  console.log(`hour: ${now.getHours()}, minute: ${now.getMinutes()}`);

  return (
    <div className="p-24">
      <h1>--{data?.something}--</h1>
    </div>
  );
}
