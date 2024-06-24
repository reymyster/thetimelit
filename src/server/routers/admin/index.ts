import { router } from "@/server/trpc";
import { quoteRouter } from "./quotes";

export const adminRouter = router({
  quotes: quoteRouter,
});
