import { router, authedProcedure as proc } from "@/server/trpc";
import { z } from "zod";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";
import { SaveQuoteSchema } from "@/lib/db/admin/schemas";

import {
  getNumberFromTimeString,
  getTimeStringFromNumber,
} from "@/lib/times/functions";

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
      filter: e.op(quote.deleted, "=", false),
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
            id: true,
            name: true,
          },
          src: {
            id: true,
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
    const lower = getNumberFromTimeString(input.timeLower);
    const upper = getNumberFromTimeString(input.timeUpper);
    let timeInput =
      typeof lower !== "undefined" && typeof upper !== "undefined"
        ? e.tuple({
            period: e.range({ inc_lower: true, inc_upper: true }, lower, upper),
            specific: input.timeSpecific,
          })
        : e.cast(
            e.tuple({ period: e.range(e.int32), specific: e.bool }),
            e.set(),
          );

    const query = e.update(e.Quote, () => {
      return {
        filter_single: { id: input.id },
        set: {
          text: input.text,
          auth: getAuthorByID(input.author),
          src: getSourceByID(input.src),
          proposedAuthor: input.proposedAuthor ?? e.cast(e.str, e.set()),
          proposedSource: input.proposedSource ?? e.cast(e.str, e.set()),
          highlight: input.highlight,
          day: input.day === -1 ? null : input.day,
          time: timeInput,
        },
      };
    });

    const result = await query.run(client);
    return result;
  }),
  delete: proc.input(z.string().uuid()).mutation(async ({ input }) => {
    const query = e.update(e.Quote, () => ({
      filter_single: { id: input },
      set: {
        deleted: true,
      },
    }));

    const result = await query.run(client);
    return result;
  }),
});
