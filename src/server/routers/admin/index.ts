import { router } from "@/server/trpc";
import { quoteRouter } from "./quotes";
import { authorRouter } from "./authors";

export const adminRouter = router({
  quotes: quoteRouter,
  authors: authorRouter,
});
