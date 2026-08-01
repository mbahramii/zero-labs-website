import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

// Vazirmatn: a Persian-optimized geometric sans, the closest match to an
// Apple-style system font while covering Farsi glyphs properly.
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "مزون‌فلو | هوش مصنوعی برای تولید و انتشار محتوا",
  description:
    "یک پیام بنویسید. هوش مصنوعی محتوای هر پلتفرم را می‌سازد و در پس‌زمینه، بدون دخالت شما منتشر می‌کند.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // dir="rtl" + lang="fa" are required at the html level for correct
    // text direction, form controls, and native scrollbar placement.
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-bg font-sans antialiased">{children}</body>
    </html>
  );
}
