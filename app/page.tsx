import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import FooterSection from "./components/FooterSection";
import ShaderBackground from "./components/ShaderBackground";

export default function Home() {
  return (
    <main className="relative">
      <ShaderBackground />
      {/* Dark overlay on top of shader */}
      <div className="fixed inset-0 z-[1] bg-black/60 pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <FooterSection />
      </div>
    </main>
  );
}
