import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/_app";
import { auth } from "@clerk/nextjs/server";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => {
      const { userId } = auth();
      return { user_id: userId ?? "" };
    },
  });

export { handler as GET, handler as POST };
