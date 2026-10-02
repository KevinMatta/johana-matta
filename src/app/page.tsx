import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import MaskSection from "@/components/MaskSection";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import ScrollRefresh from "@/components/ScrollRefresh";
import DebugPanel from "@/components/DebugPanel";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <MaskSection />
        <Services />
        <Portfolio />
      </main>
      <Footer />
      <ScrollRefresh />
      <DebugPanel />
    </>
  );
}
