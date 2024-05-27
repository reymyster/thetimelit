"use client";

import { trpc } from "@/app/_trpc/client";

const today = new Date();

export default function Page() {
  const { status, data } = trpc.hi.useQuery({ date: today });

  console.log({ status, data });

  return (
    <div className="p-24">
      <h1>--{data?.something}--</h1>
    </div>
  );
}
