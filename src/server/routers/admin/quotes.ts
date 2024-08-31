import { router, authedProcedure as proc } from "@/server/trpc";
import { z } from "zod";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";
import { SaveQuoteSchema } from "@/lib/db/admin/schemas";
import { inferProcedureOutput } from "@trpc/server";

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

function getQuoteByID(id: string) {
  return e.select(e.Quote, () => ({ filter_single: { id } }));
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
      times: {
        ...e.TimePeriod["*"],
      },
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
          times: {
            id: true,
            period: true,
            specific: true,
          },
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
    const newRanges =
      typeof lower === "undefined" || typeof upper === "undefined"
        ? []
        : lower < upper
          ? [{ lower, upper }]
          : [
              { lower: 0, upper },
              { lower, upper: 2400 },
            ];

    if (!input.id) {
      const newRs = await client.transaction(async (tx) => {
        const insertQuery = e.insert(e.Quote, {
          text: input.text,
          auth: getAuthorByID(input.author),
          src: getSourceByID(input.src),
          proposedAuthor: input.proposedAuthor ?? e.cast(e.str, e.set()),
          proposedSource: input.proposedSource ?? e.cast(e.str, e.set()),
          highlight: input.highlight,
          day: input.day === -1 ? null : input.day,
        });

        const newID = await insertQuery.run(tx);

        newRanges.forEach(async (r) => {
          const insert = e.insert(e.TimePeriod, {
            period: e.range(
              { inc_lower: true, inc_upper: true },
              r.lower,
              r.upper,
            ),
            specific: input.timeSpecific,
            quote: getQuoteByID(newID.id),
          });
          await insert.run(tx);
        });

        return newID;
      });
      return newRs;
    }

    const id = input.id ?? "";

    const queryExistingTimePeriods = e.select(e.Quote, (q) => {
      return {
        times: {
          id: true,
          period: true,
          specific: true,
        },
        filter_single: { id },
      };
    });

    const query = e.update(e.Quote, () => {
      return {
        filter_single: { id },
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

    function areRangesEqual(
      a: { lower: number; upper: number }[],
      b: { lower: number; upper: number }[],
    ): boolean {
      if (a.length !== b.length) return false;

      for (let i = 0; i < a.length; i++) {
        if (a[i].lower !== b[i].lower || a[i].upper !== b[i].upper)
          return false;
      }

      return true;
    }

    const rs = await client.transaction(async (tx) => {
      const result = await query.run(tx);

      const existingTimePeriods =
        (await queryExistingTimePeriods.run(tx))?.times ?? [];

      const oldRanges = existingTimePeriods
        .map((tp) => ({
          lower: tp.period.lower ?? 0,
          upper: tp.period.upper ?? 2400,
        }))
        .toSorted((a, b) => a.lower - b.lower);

      if (areRangesEqual(oldRanges, newRanges)) return result;

      const tpIDsToDelete = existingTimePeriods.map((tp) => tp.id);
      if (tpIDsToDelete.length > 0) {
        const deleteExistingTimePeriods = e.delete(e.TimePeriod, (tp) => ({
          filter: e.op(
            tp.id,
            "in",
            e.array_unpack(e.literal(e.array(e.uuid), tpIDsToDelete)),
          ),
        }));
        await deleteExistingTimePeriods.run(tx);
      }

      if (newRanges.length > 0) {
        newRanges.forEach(async (r) => {
          const insert = e.insert(e.TimePeriod, {
            period: e.range(
              { inc_lower: true, inc_upper: true },
              r.lower,
              r.upper,
            ),
            specific: input.timeSpecific,
            quote: getQuoteByID(id),
          });
          await insert.run(tx);
        });
      }

      return result;
    });

    return rs;
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

export type QuoteRouter = typeof quoteRouter;
export type GetAllQuotesReturnType = inferProcedureOutput<
  QuoteRouter["getAll"]
>;
export type GetSingleQuoteReturnType = inferProcedureOutput<
  QuoteRouter["getSingle"]
>;
