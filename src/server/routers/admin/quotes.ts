import { router, authedProcedure as proc } from "@/server/trpc";
import { z } from "zod";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";

const client = createClient();

export const quoteRouter = router({
  ping: proc.query(({ ctx }) => {
    return `${new Date().toLocaleDateString()} - id: ${ctx.user_id}`;
  }),
  getSingle: proc
    .input(z.string().uuid().optional())
    .query(async ({ input }) => {
      if (!input) return null;

      const query = e.select(e.Quote, (quote) => {
        return {
          id: true,
          auth: {
            name: true,
          },
          src: {
            title: true,
            author: {
              name: true,
            },
          },
          day: true,
          time: true,
          text: true,
          highlight: true,
          proposedAuthor: true,
          proposedSource: true,
          filter_single: { id: input },
        };
      });

      const result = await query.run(client);

      return result;
    }),
});
