import Image from "next/image";

// Compact "امروز" summary card shown on mobile/tablet, below the CTA
// buttons — replaces the full HeroVisual card at those breakpoints.
// Drop your exported asset at: public/images/home/dashboard-today.png
export default function MobileHeroCard() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xs lg:hidden">
      <Image
        src="/images/home/dashboard-today.png"
        alt="داشبورد امروز مزون‌فلو"
        fill
        sizes="90vw"
        className="object-contain"
      />
    </div>
  );
}