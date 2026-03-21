import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import ClientsSection from "./components/ClientsSection";
import FooterSection from "./components/FooterSection";
import ShaderBackground from "./components/ShaderBackground";

export default function Home() {
  return (
    <main>
      <ShaderBackground />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ClientsSection />
      <FooterSection />
    </main>
  );
}
