import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AIFab } from "@/components/AIFab";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <ScrollReveal />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <AIFab />
    </>
  );
}
