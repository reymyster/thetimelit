import { initTRPC } from "@trpc/server";
import superjson from "superjson";

interface Context {
  user_id: string;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
