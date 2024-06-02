import { router, publicProcedure as proc } from "@/server/trpc";
import { z } from "zod";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";

const client = createClient();

type ID = string | undefined;

function getAuthorByID(id: ID) {
  if (!id) return null;
  return e.select(e.Author, () => ({ filter_single: { id } }));
}

function getSourceByID(id: ID) {
  if (!id) return null;
  return e.select(e.Src, () => ({ filter_single: { id } }));
}

function getUserByID(id: ID) {
  if (!id) return null;
  return e.select(e.User, () => ({ filter_single: { id } }));
}

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
  getAllBasic: proc.query(async () => {
    const query = e.select(e.Quote, (quote) => {
      return {
        id: true,
        text: true,
        highlight: true,
        order_by: [{ expression: quote.created_at, direction: e.DESC }],
      };
    });

    return await query.run(client);
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
  create: proc
    .input(
      z.object({
        text: z.string().min(0),
        auth: z.string().uuid().optional(),
        src: z.string().uuid().optional(),
        proposedAuthor: z.string().optional(),
        proposedSource: z.string().optional(),
        submitted_by: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const query = e.insert(e.Quote, {
        text: input.text,
        auth: getAuthorByID(input.auth),
        src: getSourceByID(input.src),
        proposedAuthor: input.proposedAuthor,
        proposedSource: input.proposedSource,
        submitted_by: getUserByID(input.submitted_by),
      });
      const result = await query.run(client);
      return result;
    }),
  save: proc
    .input(
      z.object({
        id: z.string().uuid(),
        text: z.string().min(0),
        auth: z.string().uuid().optional(),
        src: z.string().uuid().optional(),
        day: z.number().optional(),
        time: z
          .object({
            period: z.object({ start: z.number(), end: z.number() }),
            fullday: z.boolean(),
          })
          .optional(),
        proposedAuthor: z.string().optional(),
        proposedSource: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const query = e.update(e.Quote, () => {
        const time = input.time
          ? e.tuple({
              period: e.range(
                input.time.period.start,
                input.time.period.end + 1,
              ),
              fullday: input.time.fullday,
            })
          : null;
        return {
          filter_single: { id: input.id },
          set: {
            text: input.text,
            auth: getAuthorByID(input.auth),
            src: getSourceByID(input.src),
            day: input.day,
            time,
            proposedAuthor: input.proposedAuthor,
            proposedSource: input.proposedSource,
          },
        };
      });

      const result = await query.run(client);
      return result;
    }),
});
