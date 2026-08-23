import { Sparkles, Target, Users, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";

// Company values and team members data
const values = [
  {
    icon: Zap,
    title: "نوآوری",
    description: "همیشه به دنبال راه‌حل‌های خلاقانه و جدید برای چالش‌های کسب‌وکار هستیم.",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    icon: Shield,
    title: "اعتماد",
    description: "با شفافیت کامل کار می‌کنیم و امنیت داده‌های شما اولویت ماست.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Users,
    title: "همکاری",
    description: "موفقیت شما، موفقیت ماست. در هر مرحله کنار شما هستیم.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Globe,
    title: "دسترسی جهانی",
    description: "راه‌حل‌هایی می‌سازیم که مرزها را بشکنند و به همه جا برسند.",
    color: "bg-purple-500/10 text-purple-500",
  },
];

const teamMembers = [
  {
    name: "محمد بهرامی",
    role: "بنیان‌گذار و مدیرعامل",
    bio: "متخصص در توسعه نرم‌افزار و اتوماسیون کسب‌وکار",
  },
  {
    name: "مهدی",
    role: "توسعه‌دهنده بک‌اند",
    bio: "متخصص Python و FastAPI با تمرکز بر مقیاس‌پذیری",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/5 to-bg px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent">
            <Sparkles className="h-4 w-4" />
            درباره مزون‌فلو
          </div>
          <h1 className="mb-6 text-4xl font-bold text-text-primary md:text-5xl">
            ما آینده اتوماسیون را می‌سازیم
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            مزون‌فلو یک پلتفرم هوشمند برای مدیریت و انتشار محتوا در شبکه‌های اجتماعی است.
            ما به کسب‌وکارها کمک می‌کنیم تا با قدرت هوش مصنوعی، حضور دیجیتال خود را متحول کنند.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-text-primary">ماموریت ما</h2>
              <p className="mb-4 text-text-secondary">
                ما معتقدیم که هر کسب‌وکاری، فارغ از اندازه‌اش، باید به ابزارهای حرفه‌ای برای مدیریت حضور دیجیتال دسترسی داشته باشد.
              </p>
              <p className="text-text-secondary">
                پلتفرم ما با ترکیب هوش مصنوعی و اتوماسیون، فرآیند تولید و انتشار محتوا را ساده‌تر، سریع‌تر و هوشمندتر می‌کند.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-soft p-8">
              <Target className="mb-4 h-12 w-12 text-accent" />
              <h3 className="mb-3 text-xl font-bold text-text-primary">چشم‌انداز</h3>
              <p className="text-text-secondary">
                تبدیل شدن به مرجع اصلی مدیریت محتوا و اتوماسیون بازاریابی دیجیتال در منطقه، با تمرکز بر نوآوری و رضایت مشتری.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-y border-border bg-surface-soft/50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-text-primary">
            ارزش‌های ما
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-bg p-6 transition-all hover:border-accent hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${value.color}`}>
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-text-primary">{value.title}</h3>
                <p className="text-sm text-text-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-text-primary">
            تیم ما
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-border bg-surface-soft p-6 text-center transition-all hover:border-accent"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-2xl font-bold text-accent">
                  {member.name.charAt(0)}
                </div>
                <h3 className="mb-1 text-lg font-bold text-text-primary">{member.name}</h3>
                <p className="mb-3 text-sm text-accent">{member.role}</p>
                <p className="text-sm text-text-secondary">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-primary">
            آماده‌اید شروع کنید؟
          </h2>
          <p className="mb-8 text-text-secondary">
            همین حالا به جمع هزاران کسب‌وکاری بپیوندید که با مزون‌فلو حضور دیجیتال خود را متحول کرده‌اند.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(47,111,235,0.7)] transition-transform hover:scale-[1.03]"
            >
              <Sparkles className="h-4 w-4" />
              شروع رایگان
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}