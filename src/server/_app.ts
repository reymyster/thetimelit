import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { publicRouter } from "./routers/public";

export const appRouter = router({
  greeting: publicProcedure.query(() => "hello tRPC v10!"),
  hi: publicProcedure.input(z.object({ date: z.date() })).query(({ input }) => {
    console.log(
      `hour: ${input.date.getHours()}, minute: ${input.date.getMinutes()}`,
    );

    return { something: `hi: ${input.date.getDay()}` };
  }),
  public: publicRouter,
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;
