import { FaReact, FaJava, FaHtml5, FaCss3Alt, FaFigma, FaDatabase, FaCode } from "react-icons/fa";
import { SiJavascript, SiTailwindcss, SiSpringboot } from "react-icons/si";
import { BiCodeBlock, BiPalette } from "react-icons/bi";
import { HiCode } from "react-icons/hi";
import { BsBraces, BsCodeSlash } from "react-icons/bs";
import HeroSection from "./sections/HeroSection";
import About from "./sections/About";
import Study from "./sections/Study";
import Contact from "./sections/Contact";
import SEO from "../components/SEO";

// Composant pour le background avec icônes
function IconsBackground() {
    const icons = [
        { Icon: FaReact, x: 5, y: 10 },
        { Icon: FaHtml5, x: 25, y: 5 },
        { Icon: FaCss3Alt, x: 45, y: 15 },
        { Icon: SiJavascript, x: 65, y: 8 },
        { Icon: FaJava, x: 85, y: 12 },
        { Icon: BsCodeSlash, x: 15, y: 30 },
        { Icon: FaFigma, x: 35, y: 25 },
        { Icon: SiTailwindcss, x: 55, y: 35 },
        { Icon: FaDatabase, x: 75, y: 28 },
        { Icon: BiCodeBlock, x: 95, y: 32 },
        { Icon: HiCode, x: 10, y: 50 },
        { Icon: BsBraces, x: 30, y: 55 },
        { Icon: BiPalette, x: 50, y: 48 },
        { Icon: FaCode, x: 70, y: 52 },
        { Icon: SiSpringboot, x: 90, y: 45 },
        { Icon: FaReact, x: 20, y: 70 },
        { Icon: BsCodeSlash, x: 40, y: 75 },
        { Icon: FaHtml5, x: 60, y: 68 },
        { Icon: FaCss3Alt, x: 80, y: 72 },
        { Icon: FaFigma, x: 8, y: 85 },
        { Icon: SiJavascript, x: 28, y: 90 },
        { Icon: BiCodeBlock, x: 48, y: 88 },
        { Icon: FaDatabase, x: 68, y: 92 },
        { Icon: HiCode, x: 88, y: 85 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {icons.map((item, index) => (
                <item.Icon
                    key={index}
                    className="absolute text-blue-400/[0.14] text-5xl md:text-6xl"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                />
            ))}
        </div>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen relative">
            <SEO
                title="TCHAMIE Jephte — Développeur Web & UI/UX Designer | Portfolio"
                description="Portfolio de TCHAMIE Jephte — Développeur Web Full-Stack et UI/UX Designer basé à Lomé, Togo. Spécialisé en React, Node.js, Java, Spring Boot et Figma."
                path="/"
            />
            {/* Background avec icônes */}
            <IconsBackground />

            {/* Section Hero */}
            <HeroSection />

            {/* Section À propos */}
            <About />

            {/* Section Parcours Académique */}
            <Study />

            {/* Section Contact / Footer */}
            <Contact />
        </div>
    );
}