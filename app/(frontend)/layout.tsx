import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ClimateAIChatbot } from "@/components/ClimateAIChatbot";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <ScrollReveal />
      <main id="main" className="flex-1 z-main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <ClimateAIChatbot />
    </>
  );
}
