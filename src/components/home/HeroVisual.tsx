import Image from "next/image";

// Desktop/laptop hero graphic — full analytics preview card (rings +
// activity feed). Only shown at lg and up, matching the design where the
// big card is laptop-only.
// Drop your exported asset at: public/images/home/dashboard-hero.png
export default function HeroVisual() {
  return (
    <div className="relative mx-auto hidden aspect-[4/3] w-full max-w-lg lg:mx-0 lg:block">
      {/* Ambient accent glow sitting behind the image */}
      <div className="absolute inset-0 -z-10 rounded-[2rem] bg-accent/30 blur-[90px]" aria-hidden />
      <Image
        src="/images/home/dashboard-hero.png"
        alt="پیش‌نمایش داشبورد مزون‌فلو"
        fill
        priority
        sizes="(min-width: 1024px) 520px, 90vw"
        className="animate-float object-contain"
      />
    </div>
  );
}