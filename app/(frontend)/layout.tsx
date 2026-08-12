import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ClimateAIChatbot } from "@/components/ClimateAIChatbot";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PageLoader } from "@/components/PageLoader";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <Nav />
      <ScrollReveal />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ClimateAIChatbot />
    </>
  );
}
