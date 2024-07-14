import { router, authedProcedure as proc } from "@/server/trpc";
import { z } from "zod";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";
import { SaveQuoteSchema } from "@/lib/db/admin/schemas";

const client = createClient();

export const quoteRouter = router({
  ping: proc.query(({ ctx }) => {
    return `${new Date().toLocaleDateString()} - id: ${ctx.user_id}`;
  }),
  getAll: proc.query(async () => {
    // const query = e.select(e.Quote, (quote) => {
    //   return {
    //     ...e.Quote["*"],
    //     auth: { ...e.Author["*"] },
    //     src: { ...e.Src["*"] },
    //     verified_by: { ...e.User["*"] },
    //   };
    // });
    const query = e.select(e.Quote, (quote) => ({
      ...e.Quote["*"],
      order_by: {
        expression: quote.created_at,
        direction: e.DESC,
      },
      limit: e.int32(500),
    }));

    const result = await query.run(client);

    return result;
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
  save: proc.input(SaveQuoteSchema).mutation(async ({ input, ctx }) => {
    let timeInput = input.time
      ? e.tuple({
          period: e.range(
            { inc_lower: true, inc_upper: true },
            input.time.lower,
            input.time.upper,
          ),
          specific: input.time.specific,
        })
      : undefined;

    const query = e.update(e.Quote, () => {
      return {
        filter_single: { id: input.id },
        set: {
          text: input.text,
          highlight: input.highlight,
          day: input.day,
          time: timeInput,
        },
      };
    });

    const result = await query.run(client);
    return result;
  }),
  delete: proc.input(z.string().uuid()).mutation(async ({ input }) => {
    const query = e.delete(e.Quote, () => ({
      filter_single: { id: input },
    }));

    const result = await query.run(client);
    return result;
  }),
});
