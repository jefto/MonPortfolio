import Navbar from "../components/Navbar";
import HeroSection from "./sections/HeroSection";
import DualPortalSection from "./sections/DualPortalSection";
import ExperienceSpectrumSection from "./sections/ExperienceSpectrumSection";
import VolunteeringSection from "./sections/VolunteeringSection";
import Study from "./sections/Study";
import Contact from "./sections/Contact";
import SEO from "../components/SEO";

export default function Home() {
    return (
        <div className="min-h-screen relative bg-[#FAF8F5] text-zinc-900 overflow-x-hidden">
            <SEO
                title="TCHAMIE Jephte — Ingénieur Génie Logiciel & UI/UX Designer | Portfolio"
                description="Portfolio de TCHAMIE Jephte — Ingénieur Logiciel Full-Stack et UI/UX Designer basé à Lomé, Togo. Spécialisé en React, Node.js, Java, Spring Boot et Figma."
                path="/"
            />

            <Navbar variant="light" />

            <HeroSection />

            <DualPortalSection />

            <ExperienceSpectrumSection />

            <VolunteeringSection />

            <div id="education-section">
                <Study />
            </div>

            <div id="contact-section">
                <Contact />
            </div>
        </div>
    );
}
