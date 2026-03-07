import { ReactNode, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Add stem-theme class to body so dialogs/popovers inherit variables too
    document.body.classList.add("stem-theme");
    return () => {
      document.body.classList.remove("stem-theme");
    };
  }, []);

  return (
    <div className="stem-theme flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
