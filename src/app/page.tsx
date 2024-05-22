import { TextGeneration } from "./text-generation";

export default function Home() {
  return (
    <main className="flex flex-grow flex-col items-center justify-center">
      <div className="bg-background/50 border-background/50 mx-8 rounded-3xl border p-12 pt-8 shadow-xl backdrop-blur-sm lg:max-w-4xl lg:p-24 lg:pt-20">
        <TextGeneration />
      </div>
    </main>
  );
}
