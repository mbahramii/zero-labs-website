import { ArrowLeft, Play, ShieldCheck } from "lucide-react";
import HeroVisual from "./HeroVisual";
import MobileHeroCard from "./MobileHeroCard";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 lg:pb-32 lg:pt-24">
      {/* Ambient radial glow behind the headline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(47,111,235,0.18),transparent_60%)]"
        aria-hidden
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Text column */}
        <div className="text-center lg:text-right">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent-light">
            ✦ هوش مصنوعی برای تولید و انتشار محتوا
          </span>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-text-primary sm:text-5xl">
            محتوایی که
            <br />
            <span className="gradient-text text-5xl sm:text-6xl">خودش</span>
            <br />
            منتشر می‌شود.
          </h1>

          <p className="mx-auto mb-8 max-w-lg text-base leading-8 text-text-secondary lg:mx-0">
            یک پیام بنویسید. هوش مصنوعی محتوای هر پلتفرم را می‌سازد و در پس‌زمینه، بدون دخالت شما منتشر می‌کند.
          </p>

          <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#start"
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_rgba(47,111,235,0.7)] transition-transform hover:scale-[1.03]"
            >
              <ArrowLeft className="h-4 w-4" />
              شروع رایگان
            </a>
           <a 
              href="#demo"
              className="flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong"
            >
              <Play className="h-4 w-4" />
              مشاهده دمو
            </a>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-xs text-text-tertiary lg:justify-start">
            <ShieldCheck className="h-4 w-4" />
            بدون نیاز به کارت اعتباری
          </p>
        </div>

        {/* Visual column: HeroVisual on lg+, MobileHeroCard below that */}
        <div>
          <HeroVisual />
          <MobileHeroCard />
        </div>
      </div>
    </section>
  );
}