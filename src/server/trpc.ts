import { TRPCError, initTRPC } from "@trpc/server";
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

export const authedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;

  if (ctx.user_id.length === 0) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      user_id: ctx.user_id,
    },
  });
});
