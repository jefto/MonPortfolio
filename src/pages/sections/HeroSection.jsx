import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import profilePhoto from "../../assets/tof.jpg";
import { HeroFramedPhoto } from "../../components/ui";
import {
    getCV,
    downloadCV,
    getStatistics,
    formatWhatsAppUrl,
    DEFAULT_CONTACT_INFO,
} from "../../services/api";

export default function HeroSection() {
    const navigate = useNavigate();
    const [cvData, setCvData] = useState(null);
    const [cvLoading, setCvLoading] = useState(true);
    const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
    const [heroFraming, setHeroFraming] = useState({
        heroPhotoUrl: "",
        heroPhotoScale: 1.0,
        heroPhotoX: 0.0,
        heroPhotoY: 0.0,
    });

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const [cv, stats] = await Promise.all([
                    getCV().catch(() => null),
                    getStatistics().catch(() => null),
                ]);
                setCvData(cv);
                if (stats) {
                    setContactInfo({
                        contactPhone: stats.contactPhone || DEFAULT_CONTACT_INFO.contactPhone,
                        contactEmail: stats.contactEmail || DEFAULT_CONTACT_INFO.contactEmail,
                        contactLocation: stats.contactLocation || DEFAULT_CONTACT_INFO.contactLocation,
                    });
                    setHeroFraming({
                        heroPhotoUrl: stats.heroPhotoUrl || "",
                        heroPhotoScale: stats.heroPhotoScale !== undefined ? Number(stats.heroPhotoScale) : 1.0,
                        heroPhotoX: stats.heroPhotoX !== undefined ? Number(stats.heroPhotoX) : 0.0,
                        heroPhotoY: stats.heroPhotoY !== undefined ? Number(stats.heroPhotoY) : 0.0,
                    });
                }
            } catch (err) {
                console.error("Erreur chargement Hero:", err);
            } finally {
                setCvLoading(false);
            }
        };
        fetchHeroData();
    }, []);

    const activePhoto = heroFraming.heroPhotoUrl || profilePhoto;

    return (
        <section className="relative px-4 sm:px-8 md:px-16 pt-6 sm:pt-8 md:pt-10 pb-14 md:pb-20 overflow-hidden">
            {/* Figures architecturales en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {/* Anneaux orbitaux dorés / architecturaux côté droit */}
                <svg
                    className="absolute right-[-4%] top-[-8%] w-[520px] h-[520px] text-zinc-900/15"
                    viewBox="0 0 500 500"
                    fill="none"
                >
                    <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                    <circle cx="250" cy="250" r="165" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="250" cy="250" r="110" stroke="#d97706" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M 30 250 L 470 250 M 250 30 L 250 470" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="135" y="135" width="230" height="230" stroke="currentColor" strokeWidth="1.2" transform="rotate(45 250 250)" />
                </svg>

                {/* Polygone géométrique côté gauche */}
                <svg
                    className="absolute -left-16 bottom-0 w-[380px] h-[380px] text-blue-600/20"
                    viewBox="0 0 360 360"
                    fill="none"
                >
                    <polygon points="180,20 340,180 180,340 20,180" stroke="currentColor" strokeWidth="1.6" />
                    <polygon points="180,65 295,180 180,295 65,180" stroke="currentColor" strokeWidth="1.4" strokeDasharray="6 6" />
                    <circle cx="180" cy="180" r="45" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 justify-between items-center">
                    {/* Colonne Éditoriale & Double Compétence */}
                    <div className="flex flex-col gap-5 text-left lg:flex-1 w-full">
                        <div className="inline-flex items-center gap-3 w-fit px-3.5 py-1.5 rounded-full bg-white border border-zinc-300 text-xs font-mono text-zinc-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>LOMÉ, TOGO — INGÉNIERIE LOGICIELLE &amp; DIRECTION DESIGN</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-zinc-950 font-abril tracking-tight">
                            TCHAMIE JEPHTE
                        </h1>

                        <div className="flex flex-wrap items-center gap-3 text-lg sm:text-2xl font-poppins font-semibold text-zinc-900">
                            <span className="px-3.5 py-1 rounded bg-zinc-950 text-white font-mono text-sm sm:text-base">
                                01 // INGÉNIEUR GÉNIE LOGICIEL
                            </span>
                            <span className="text-zinc-400 font-mono">&amp;</span>
                            <span className="px-3.5 py-1 rounded bg-amber-500/20 border border-amber-600/40 text-amber-900 font-mono text-sm sm:text-base">
                                02 // UI/UX &amp; BRAND DESIGNER
                            </span>
                        </div>

                        <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-2xl font-poppins">
                            Conception d&apos;architectures web full-stack (React, Node.js, Java, Spring Boot, PostgreSQL) et réalisation de systèmes d&apos;interfaces, prototypes Figma et identités visuelles.
                        </p>

                        {/* Accès Immédiat aux 2 Univers (Immanquable dès le Hero) */}
                        <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
                            <motion.button
                                type="button"
                                onClick={() => navigate("/dev")}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="group flex items-center justify-between px-5 py-4 rounded-xl bg-zinc-950 text-white border border-zinc-950 hover:bg-zinc-900 transition-colors text-left"
                            >
                                <div>
                                    <span className="block font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                                        UNIVERS 01 · CODE &amp; ARCHI
                                    </span>
                                    <span className="font-semibold text-sm sm:text-base">
                                        Explorer l&apos;Engineering
                                    </span>
                                </div>
                                <span className="font-mono text-lg text-emerald-400 group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={() => navigate("/design")}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="group flex items-center justify-between px-5 py-4 rounded-xl bg-white text-zinc-950 border border-zinc-900 hover:bg-amber-500 hover:border-amber-500 transition-colors text-left"
                            >
                                <div>
                                    <span className="block font-mono text-[10px] uppercase tracking-widest text-amber-700 group-hover:text-zinc-950">
                                        UNIVERS 02 · UI/UX &amp; BRAND
                                    </span>
                                    <span className="font-semibold text-sm sm:text-base">
                                        Explorer le Studio Design
                                    </span>
                                </div>
                                <span className="font-mono text-lg text-zinc-950 group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </motion.button>
                        </div>

                        {/* Barre de coordonnées & Téléchargement CV */}
                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-200 text-sm font-poppins">
                            {cvLoading ? (
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-200 text-zinc-600 rounded-lg font-mono text-xs">
                                    <span className="animate-spin w-3.5 h-3.5 border-2 border-zinc-600 border-t-transparent rounded-full" />
                                    Vérification du CV...
                                </div>
                            ) : cvData ? (
                                <button
                                    type="button"
                                    onClick={downloadCV}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs uppercase tracking-wider transition-colors"
                                >
                                    <MdOutlineFileDownload className="text-base" />
                                    Télécharger le CV (PDF)
                                </button>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 border border-zinc-300 text-zinc-500 rounded-lg font-mono text-xs">
                                    CV sur demande
                                </span>
                            )}

                            <a
                                href={formatWhatsAppUrl(contactInfo.contactPhone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Discuter directement sur WhatsApp"
                                className="inline-flex items-center gap-2 text-zinc-700 hover:text-emerald-700 font-mono text-xs transition-colors"
                            >
                                <FaWhatsapp className="text-base text-emerald-600" />
                                <span>{contactInfo.contactPhone}</span>
                            </a>

                            <a
                                href={`mailto:${contactInfo.contactEmail}`}
                                className="inline-flex items-center gap-2 text-zinc-700 hover:text-zinc-950 font-mono text-xs transition-colors"
                            >
                                <TfiEmail className="text-sm text-blue-600" />
                                <span>{contactInfo.contactEmail}</span>
                            </a>
                        </div>
                    </div>

                    {/* Colonne Portrait Architectural avec cadrage dynamique */}
                    <div className="flex lg:flex-none justify-center items-center">
                        <HeroFramedPhoto
                            src={activePhoto}
                            scale={heroFraming.heroPhotoScale}
                            x={heroFraming.heroPhotoX}
                            y={heroFraming.heroPhotoY}
                            interactive={true}
                            id="hero_main"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
