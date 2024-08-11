import { router, authedProcedure as proc } from "@/server/trpc";
import { z } from "zod";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";

const client = createClient();

export const authorRouter = router({
  getActive: proc.query(async () => {
    const query = e.select(e.Author, (author) => ({
      ...e.Author["*"],
      filter: e.op(author.deleted, "=", false),
      order_by: {
        expression: author.name,
        direction: e.ASC,
      },
    }));

    const result = await query.run(client);

    return result;
  }),
  add: proc
    .input(z.object({ name: z.string().min(2) }))
    .mutation(async ({ input }) => {
      const query = e.insert(e.Author, {
        name: input.name,
      });
      const result = await query.run(client);
      return result;
    }),
});
