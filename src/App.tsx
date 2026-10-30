import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { PurposeSection } from "@/components/sections/PurposeSection";
import { RouteSection } from "@/components/sections/RouteSection";
import { RegistrationSection } from "@/components/sections/RegistrationSection";
import { EventScheduleSection } from "@/components/sections/EventScheduleSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const checkIsAdminRoute = () => {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();

  return (
    hash === "#/admin" ||
    hash.startsWith("#/admin") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin") ||
    search.includes("admin=true")
  );
};

const App = () => {
  const [isAdminView, setIsAdminView] = useState<boolean>(() =>
    checkIsAdminRoute(),
  );

  const handleHashChange = useCallback(() => {
    const shouldBeAdmin = checkIsAdminRoute();
    setIsAdminView(shouldBeAdmin);
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [handleHashChange]);

  const handleOpenAdmin = () => {
    window.location.hash = "#/admin";
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToLanding = () => {
    if (window.location.hash.includes("admin")) {
      window.location.hash = "";
    }
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isAdminView) {
    return <AdminDashboard onBack={handleBackToLanding} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F8] text-[#121316] flex flex-col font-sans selection:bg-[#EF007E] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SponsorsSection />
        <PurposeSection />
        <RouteSection />
        <RegistrationSection />
        <EventScheduleSection />
        <FAQSection />
      </main>
      <Footer onOpenAdmin={handleOpenAdmin} />
    </div>
  );
};

export default App;
