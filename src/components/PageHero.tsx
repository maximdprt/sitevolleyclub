import Image from "next/image";

type PageHeroProps = {
  title: string;
  description?: string;
  imageSrc: string;
};

export function PageHero({ title, description, imageSrc }: PageHeroProps) {
  return (
    <section className="relative h-64 w-full overflow-hidden bg-ocean md:h-80">
      <Image src={imageSrc} alt="" fill className="object-cover opacity-70" priority />
      <div className="absolute inset-0 bg-linear-to-t from-ocean/90 via-ocean/45 to-transparent" />
      <div className="absolute inset-0 flex items-end p-6 md:p-10">
        <div className="flex w-full items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">{title}</h1>
            {description ? <p className="mt-4 text-lg text-white/85">{description}</p> : null}
          </div>
          <Image
            src="/imagesvideos/WhatsApp_Image_2026-02-24_at_20.40.11-removebg-preview.png"
            alt="Logo Lacanau Volley"
            width={160}
            height={160}
            className="hidden h-20 w-20 object-contain drop-shadow md:block md:h-28 md:w-28"
            priority
          />
        </div>
      </div>
    </section>
  );
}

