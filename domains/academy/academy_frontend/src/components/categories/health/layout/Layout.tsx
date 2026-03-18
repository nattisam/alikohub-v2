import { Header } from "./Header";
import { Footer } from "./Footer";
import { StateProvider } from "@/contexts/StateContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <StateProvider>
      <div className="health-theme min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </StateProvider>
  );
}
