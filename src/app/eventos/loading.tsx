export default function Loading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
    >
      <span className="sr-only">Carregando…</span>
      <div aria-hidden="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-terra-100 bg-terra-50/50 motion-reduce:animate-none"
          >
            <div className="aspect-[4/3] bg-terra-100" />
            <div className="space-y-3 p-6">
              <div className="h-4 w-1/3 rounded-full bg-terra-100" />
              <div className="h-6 w-3/4 rounded bg-terra-100" />
              <div className="h-4 w-full rounded bg-terra-100" />
              <div className="h-11 w-full rounded-full bg-terra-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
