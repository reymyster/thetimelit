export default function DayOfTheWeekPage() {
  return (
    <main className="flex flex-grow flex-col items-center justify-center">
      <div className="bg-primary/50 text-primary-foreground/80 border-primary/50 mx-8 rounded-3xl border p-12 shadow-xl backdrop-blur-sm lg:max-w-4xl lg:p-24">
        <blockquote className="text-balance text-2xl lg:text-4xl">
          <p>
            On the <span className="font-bold">Monday</span> morning, so far as
            I can tell it, nothing happened to disturb the customary quiet of
            the house.
          </p>
          <footer className="mt-4 text-lg">
            <cite>&quot;The Moonstone&quot;</cite> by Wilkie Collins
          </footer>
        </blockquote>
      </div>
    </main>
  );
}
