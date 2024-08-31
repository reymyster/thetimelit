import { z } from "zod";

import {
  getNumberFromTimeString,
  getTimeStringFromNumber,
} from "@/lib/times/functions";

export const SaveQuoteSchema = z
  .object({
    id: z.string().uuid().optional(),
    text: z
      .string()
      .min(5, { message: "Quote text must be at least 5 characters." }),
    proposedAuthor: z.string().optional(),
    proposedSource: z.string().optional(),
    author: z.string().uuid().optional(),
    src: z.string().uuid().optional(),
    highlight: z
      .object({ startOffset: z.number(), endOffset: z.number() })
      .refine((data) => data.startOffset < data.endOffset, {
        message: "Start must be before end.",
      })
      .optional(),
    day: z.number().min(-1).max(6),
    timeUpper: z.string().optional(),
    timeLower: z.string().optional(),
    timeSpecific: z.boolean(),
  })
  .refine(
    (data) => {
      const u =
        typeof data.timeUpper === "undefined" || data.timeUpper.length === 0;
      const l =
        typeof data.timeLower === "undefined" || data.timeLower.length === 0;

      return (u && l) || (!u && !l);
    },
    {
      message: "Both Times must be filled or blank",
      path: ["timeLower"],
    },
  )
  .refine(
    (data) => {
      const upper = getNumberFromTimeString(data.timeUpper);
      const lower = getNumberFromTimeString(data.timeLower);
      const noUpper = typeof upper === "undefined";
      const noLower = typeof lower === "undefined";

      return (
        data.timeSpecific ||
        noLower ||
        noUpper ||
        (lower < 1200 && upper < 1200)
      );
    },
    {
      message: "Non-Specific Times must all be AM.",
      path: ["timeUpper"],
    },
  );
