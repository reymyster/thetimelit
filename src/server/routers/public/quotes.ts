import { router, publicProcedure as proc } from "@/server/trpc";
import { z } from "zod";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";

const client = createClient();

export const quoteRouter = router({
  getForDay: proc.input(z.date()).query(async ({ input }) => {
    const query = e.select(e.Quote, (quote) => {
      const isDate = e.op(quote.day, "=", input.getDay());
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
        filter: e.op(isDate, "and", hasHighlight),
        order_by: [{ expression: e.random() }],
        limit: 1,
      };
    });

    return (await query.run(client))?.[0];
  }),
});
