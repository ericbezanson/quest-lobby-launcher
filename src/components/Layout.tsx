
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  background?: "default" | "parchment";
}

const Layout: React.FC<LayoutProps> = ({ children, background = "default" }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${background === "parchment" ? "bg-parchment" : ""}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
