import { EditQuote } from "@/components/quotes/edit";
import { z } from "zod";

const schema = z.string().uuid();

export default function Page({ params }: { params: { id: string } }) {
  const id = schema.safeParse(params.id);

  if (!id.success)
    return <div className="bg-white text-red-800">Invalid ID</div>;

  return (
    <main className="flex flex-grow flex-col items-center p-8">
      <EditQuote id={id.data} />
    </main>
  );
}
