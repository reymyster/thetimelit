import { router, authedProcedure as proc } from "@/server/trpc";
import { z } from "zod";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";

const client = createClient();

export const sourceRouter = router({
  getActiveByAuthor: proc
    .input(z.object({ author: z.string().uuid() }))
    .query(async ({ input }) => {
      const query = e.select(e.Src, (src) => {
        const fromAuthor = e.op(src.author.id, "=", input.author);
        const isActive = e.op(src.deleted, "=", false);
        return {
          ...e.Src["*"],
          filter: e.op(fromAuthor, "and", isActive),
          order_by: {
            expression: src.title,
            direction: e.ASC,
          },
        };
      });

      const result = await query.run(client);

      return result;
    }),
  getActive: proc.query(async () => {
    const query = e.select(e.Src, (src) => ({
      ...e.Src["*"],
      filter: e.op(src.deleted, "=", false),
      order_by: [
        { expression: src.title, direction: e.ASC },
        { expression: src.author.name, direction: e.ASC },
      ],
    }));

    const result = await query.run(client);

    return result;
  }),
  add: proc
    .input(z.object({ author: z.string().uuid(), title: z.string() }))
    .mutation(async ({ input }) => {
      const query = e.insert(e.Src, {
        title: input.title,
        author: e.select(e.Author, () => ({
          filter_single: { id: input.author },
        })),
      });
      const result = await query.run(client);
      return result;
    }),
});
