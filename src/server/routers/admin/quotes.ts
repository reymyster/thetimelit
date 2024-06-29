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
  save: proc
    .input(
      z.object({
        id: z.string().uuid(),
        text: z.string().min(0),
        highlight: z
          .object({ startOffset: z.number(), endOffset: z.number() })
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const query = e.update(e.Quote, () => {
        return {
          filter_single: { id: input.id },
          set: {
            text: input.text,
            highlight: input.highlight,
          },
        };
      });

      const result = await query.run(client);
      return result;
    }),
});
