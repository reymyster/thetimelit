import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  greeting: publicProcedure.query(() => "hello tRPC v10!"),
  hi: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(({ ctx, input }) => {
      console.log({ ctx, input });

      return { something: `hi: ${input.date.getDay()}` };
    }),
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;
