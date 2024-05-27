import { router } from "@/server/trpc";
import { quoteRouter } from "./quotes";

export const publicRouter = router({
  quotes: quoteRouter,
});
