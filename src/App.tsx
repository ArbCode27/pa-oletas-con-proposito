import { Navbar } from "@/components/sections/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { SponsorsSection } from "@/components/sections/SponsorsSection"
import { PurposeSection } from "@/components/sections/PurposeSection"
import { RouteSection } from "@/components/sections/RouteSection"
import { RegistrationSection } from "@/components/sections/RegistrationSection"
import { EventScheduleSection } from "@/components/sections/EventScheduleSection"
import { FAQSection } from "@/components/sections/FAQSection"
import { Footer } from "@/components/sections/Footer"

const App = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F8] text-[#121316] flex flex-col font-sans selection:bg-[#E91E63] selection:text-white">
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
      <Footer />
    </div>
  )
}

export default App
