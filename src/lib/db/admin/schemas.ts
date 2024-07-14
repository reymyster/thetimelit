import { z } from "zod";

export const SaveQuoteSchema = z.object({
  id: z.string().uuid(),
  text: z
    .string()
    .min(5, { message: "Quote text must be at least 5 characters." }),
  proposedAuthor: z.string().optional(),
  proposedSource: z.string().optional(),
  highlight: z
    .object({ startOffset: z.number(), endOffset: z.number() })
    .refine((data) => data.startOffset < data.endOffset, {
      message: "Start must be before end.",
    })
    .optional(),
  day: z.number().min(0).max(6).optional(),
  time: z
    .object({
      lower: z.number().min(0).max(2359),
      upper: z.number().min(0).max(2359),
      specific: z.boolean(),
    })
    .refine(
      (data) => data.specific || (data.lower < 1200 && data.upper < 1200),
      {
        message: "Non-specific times must all be AM",
      },
    )
    .optional(),
});
