export default function DayOfTheWeekPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-8 rounded-3xl border border-white/50 bg-gray-100/50 p-12 text-gray-800 shadow-xl backdrop-blur-sm lg:max-w-4xl lg:p-24">
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
