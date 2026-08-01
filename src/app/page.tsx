import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero />
      <FeatureGrid />
    </main>
  );
}