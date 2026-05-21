import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AIFab } from "@/components/AIFab";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <AIFab />
    </>
  );
}
