import { SignIn } from "@clerk/nextjs";
import { GlassPanel } from "@/components/glass-panel";

export default function Page() {
  return (
    <main className="flex flex-grow flex-col items-center p-8">
      <GlassPanel className="p-8 lg:p-12">
        <SignIn />
      </GlassPanel>
    </main>
  );
}
