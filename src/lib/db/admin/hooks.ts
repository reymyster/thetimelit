import { trpc } from "@/app/_trpc/client";
import { queryOptions } from "@tanstack/react-query";

export function useGetAllQuotes() {
  return trpc.admin.quotes.getAll.useQuery();
}

export function useGetSingleQuote(id: string | undefined) {
  return trpc.admin.quotes.getSingle.useQuery(id);
}

export function useEditQuoteMutation() {
  const utils = trpc.useUtils();

  const mutation = trpc.admin.quotes.save.useMutation({
    onSuccess(input) {
      utils.admin.quotes.getAll.invalidate();
      utils.admin.quotes.getSingle.invalidate(input?.id);
    },
  });

  return mutation;
}

export function useDeleteQuoteMutation() {
  const utils = trpc.useUtils();

  const mutation = trpc.admin.quotes.delete.useMutation({
    onSuccess() {
      utils.admin.quotes.getAll.invalidate();
    },
  });

  return mutation;
}

export function useGetActiveAuthors() {
  return trpc.admin.authors.getActive.useQuery();
}

export function useCreateAuthorMutation() {
  const utils = trpc.useUtils();

  const mutation = trpc.admin.authors.add.useMutation({
    onSuccess() {
      utils.admin.authors.getActive.invalidate();
    },
  });

  return mutation;
}
