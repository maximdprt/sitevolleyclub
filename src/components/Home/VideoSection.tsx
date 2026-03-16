export function VideoSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Lacanau Volley en vidéo
        </h2>
        <p className="mt-2 text-slate-600">
          Un aperçu de l&apos;ambiance et des échanges du club.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-md">
          <video
            src="/imagesvideos/LVB Best.mp4"
            controls
            className="h-full w-full"
            poster="/imagesvideos/Images volley lacanau 1.jpg"
          />
        </div>
      </div>
    </section>
  );
}

