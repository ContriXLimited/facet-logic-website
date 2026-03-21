import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import ClientsSection from "./components/ClientsSection";
import FooterSection from "./components/FooterSection";
import PrismBackground from "./components/PrismBackground";

export default function Home() {
  return (
    <main>
      <PrismBackground />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ClientsSection />
      <FooterSection />
    </main>
  );
}
