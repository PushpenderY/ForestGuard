import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FireMapSection from "@/components/FireMapSection";
import RiskPredictor from "@/components/RiskPredictor";
import WildfireImpact from "@/components/WildfireImpact";
import EmergencyResponse from "@/components/EmergencyResponse";
import Footer from "@/components/Footer";
import DonateButton from "@/components/DonateButton";
export default function Home() {
  return (
    <main className="bg-[#07130d]">
       <Navbar/>
       <DonateButton />
       <Hero/>
       <FireMapSection/>
       <RiskPredictor/>
       <WildfireImpact/>
       <EmergencyResponse />
       <Footer/>

    </main>
  );
}
