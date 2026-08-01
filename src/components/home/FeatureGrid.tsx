import { BarChart3, Layers, MessageSquare, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: BarChart3,
    title: "تحلیل هوشمند",
    description: "عملکرد محتوا را ببینید و بهتر تصمیم بگیرید.",
  },
  {
    icon: Zap,
    title: "انتشار خودکار",
    description: "برنامه‌ریزی و انتشار خودکار بدون نیاز به حضور شما.",
  },
  {
    icon: Layers,
    title: "تولید موازی",
    description: "متن، تصویر و ویدیو هم‌زمان برای هر پلتفرم آماده می‌شود.",
  },
  {
    icon: MessageSquare,
    title: "یک پیام",
    description: "توضیح کوتاهی از آنچه می‌خواهید بنویسید.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((feature) => (
        <div
          key={feature.title}
          className="neu-card rounded-2xl p-5 transition-transform hover:-translate-y-1"
        >
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
            <feature.icon className="h-5 w-5" />
          </span>
          <h3 className="mb-1.5 text-sm font-bold text-text-primary">{feature.title}</h3>
          <p className="text-xs leading-relaxed text-text-tertiary">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}