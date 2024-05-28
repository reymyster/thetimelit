import { router, publicProcedure as proc } from "@/server/trpc";
import { z } from "zod";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";

const client = createClient();

export const quoteRouter = router({
  getForDay: proc
    .input(z.number().int().min(0).max(6))
    .query(async ({ input }) => {
      console.log({
        f: "logging getForDay input",
        input,
      });
      const query = e.select(e.Quote, (quote) => {
        const isDay = e.op(quote.day, "=", input);
        const hasHighlight = e.op("exists", quote.highlight);
        return {
          text: true,
          highlight: true,
          src: {
            title: true,
            author: {
              name: true,
            },
          },
          filter: e.op(isDay, "and", hasHighlight),
          order_by: [{ expression: e.random() }],
          limit: 1,
        };
      });

      return (await query.run(client))?.[0];
    }),
});
