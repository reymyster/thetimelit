import { router } from "@/server/trpc";
import { quoteRouter } from "./quotes";
import { authorRouter } from "./authors";
import { sourceRouter } from "./sources";

export const adminRouter = router({
  quotes: quoteRouter,
  authors: authorRouter,
  sources: sourceRouter,
});
