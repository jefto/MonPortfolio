import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjects, getImageUrl } from '../../services/api';

const springConfig = {
    type: 'spring',
    stiffness: 320,
    damping: 30,
};

export default function DualPortalSection() {
    const navigate = useNavigate();
    const [hoveredSide, setHoveredSide] = useState(null);
    const [devPreview, setDevPreview] = useState([]);
    const [designPreview, setDesignPreview] = useState([]);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            getProjects({ category: 'projet-dev' }).catch(() => []),
            getProjects({ category: 'projet-design' }).catch(() => []),
        ]).then(([devList, designList]) => {
            if (!mounted) return;
            setDevPreview((devList || []).slice(0, 3));
            setDesignPreview((designList || []).slice(0, 3));
        });
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <section
            id="dual-portal"
            className="relative px-4 sm:px-8 md:px-16 py-16 md:py-24 bg-[#FAF8F5] border-t border-b border-zinc-200 overflow-hidden"
        >
            {/* Figures géométriques en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <svg
                    className="absolute left-1/2 -translate-x-1/2 -top-24 w-[700px] h-[700px] text-zinc-900/15"
                    viewBox="0 0 600 600"
                    fill="none"
                >
                    <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 10" />
                    <circle cx="300" cy="300" r="200" stroke="currentColor" strokeWidth="1.5" />
                    <polygon points="300,40 560,300 300,560 40,300" stroke="#2563eb" strokeOpacity="0.3" strokeWidth="1.5" />
                </svg>
                <svg
                    className="absolute -right-16 bottom-6 w-[320px] h-[320px] text-amber-600/20"
                    viewBox="0 0 300 300"
                    fill="none"
                >
                    <circle cx="150" cy="150" r="120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
                    <rect x="65" y="65" width="170" height="170" stroke="currentColor" strokeWidth="1.5" transform="rotate(15 150 150)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* En-tête éditorial */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-zinc-300 gap-4">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-600 block mb-2">
                            01 // ARCHITECTURE HYBRIDE — DOUBLE COMPÉTENCE
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight font-abril">
                            Deux disciplines. Une exécution unifiée.
                        </h2>
                    </div>
                    <p className="text-sm text-zinc-600 max-w-md font-poppins leading-relaxed">
                        De la modélisation de bases de données relationnelles et d'API distribuées jusqu'aux systèmes de design haute-fidélité sur Figma. Choisissez une porte d'entrée pour inspecter les réalisations dédiées.
                    </p>
                </div>

                {/* Portail Double Interactif (Split-Screen expansif sur desktop) */}
                <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[500px]">
                    {/* VOLET 01 : ENGINEERING (DEV) */}
                    <motion.div
                        layout
                        transition={springConfig}
                        onMouseEnter={() => setHoveredSide('dev')}
                        onMouseLeave={() => setHoveredSide(null)}
                        onClick={() => navigate('/dev')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') navigate('/dev');
                        }}
                        style={{
                            flex: hoveredSide === 'dev' ? 1.35 : hoveredSide === 'design' ? 0.85 : 1,
                        }}
                        className="group relative rounded-2xl bg-zinc-950 text-zinc-100 p-7 sm:p-10 border border-zinc-800 hover:border-emerald-500/70 transition-colors cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Grille technique subtile */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-15"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
                                backgroundSize: '32px 32px',
                            }}
                        />

                        {/* Haut de carte */}
                        <div className="relative z-10">
                            <div className="flex items-center justify-between gap-2 mb-6">
                                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-3 py-1 rounded bg-zinc-900 border border-zinc-700 text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    PORTAIL 01 // SOFTWARE ENGINEERING
                                </span>
                                <span className="font-mono text-xs text-zinc-500">/dev</span>
                            </div>

                            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3 font-poppins">
                                Architecture Logicielle &amp; Full-Stack
                            </h3>
                            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
                                Conception et déploiement d'applications web robustes, API RESTful sécurisées, modélisation SQL et interfaces réactives orientées performance.
                            </p>

                            {/* Aperçu Terminal / Architecture */}
                            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 font-mono text-xs space-y-2 mb-6">
                                <div className="flex items-center justify-between text-zinc-500 pb-2 border-b border-zinc-800">
                                    <span>stack.manifest.json</span>
                                    <span className="text-emerald-400">PRODUCTION READY</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1 text-zinc-300">
                                    <div>
                                        <span className="text-zinc-500">frontend:</span> React, Tailwind
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">backend:</span> Node.js, Spring Boot
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">langages:</span> Java, JS/TS, SQL
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">data:</span> PostgreSQL, REST
                                    </div>
                                </div>
                            </div>

                            {/* Projets Dev Récents */}
                            {devPreview.length > 0 && (
                                <div className="mb-6">
                                    <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
                                        SYSTÈMES RÉCENTS ({devPreview.length}+)
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {devPreview.map((proj) => (
                                            <span
                                                key={proj.id}
                                                className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                                            >
                                                {proj.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTA Bas de carte */}
                        <div className="relative z-10 pt-6 border-t border-zinc-800/80 flex items-center justify-between gap-4">
                            <div>
                                <span className="block font-mono text-[11px] text-zinc-400 uppercase">
                                    ACCÈS DIRECT AU TERMINAL &amp; DÉPÔTS
                                </span>
                                <span className="text-sm font-semibold text-emerald-400">
                                    Ouvrir le Portfolio Engineering
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-emerald-400 text-zinc-950 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    {/* VOLET 02 : DESIGN STUDIO (UI/UX & BRANDING) */}
                    <motion.div
                        layout
                        transition={springConfig}
                        onMouseEnter={() => setHoveredSide('design')}
                        onMouseLeave={() => setHoveredSide(null)}
                        onClick={() => navigate('/design')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') navigate('/design');
                        }}
                        style={{
                            flex: hoveredSide === 'design' ? 1.35 : hoveredSide === 'dev' ? 0.85 : 1,
                        }}
                        className="group relative rounded-2xl bg-[#F3EFE6] text-zinc-950 p-7 sm:p-10 border border-zinc-900/20 hover:border-zinc-950 transition-colors cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Haut de carte */}
                        <div className="relative z-10">
                            <div className="flex items-center justify-between gap-2 mb-6">
                                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-3 py-1 rounded bg-zinc-950 text-white">
                                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                                    PORTAIL 02 // PRODUCT &amp; BRAND DESIGN
                                </span>
                                <span className="font-mono text-xs text-zinc-500">/design</span>
                            </div>

                            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-3 font-abril">
                                Systèmes UI/UX &amp; Direction Artistique
                            </h3>
                            <p className="text-zinc-700 text-sm sm:text-base leading-relaxed max-w-xl mb-6 font-poppins">
                                Conception d'interfaces centrées sur l'usage, prototypage interactif haute-fidélité sur Figma, identités visuelles et supports éditoriaux.
                            </p>

                            {/* Grille de spécifications Design */}
                            <div className="bg-white/90 border border-zinc-900/15 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pb-2 border-b border-zinc-200 mb-3">
                                    <span>DESIGN SYSTEM // TOKENS</span>
                                    <span className="text-amber-700 font-semibold">FIGMA + PRINT</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs font-poppins">
                                    <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
                                        <span className="font-mono text-[10px] text-zinc-400 block">01</span>
                                        <span className="font-semibold text-zinc-900">UI/UX Product</span>
                                    </div>
                                    <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
                                        <span className="font-mono text-[10px] text-zinc-400 block">02</span>
                                        <span className="font-semibold text-zinc-900">Prototypage</span>
                                    </div>
                                    <div className="p-2.5 rounded bg-zinc-50 border border-zinc-200">
                                        <span className="font-mono text-[10px] text-zinc-400 block">03</span>
                                        <span className="font-semibold text-zinc-900">Direction Art.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Vignettes visuelles des projets Design réels */}
                            {designPreview.length > 0 && (
                                <div className="mb-6">
                                    <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
                                        APERÇU DES CRÉATIONS ({designPreview.length}+)
                                    </p>
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {designPreview.map((proj) => (
                                            <div
                                                key={proj.id}
                                                className="h-16 rounded-lg overflow-hidden border border-zinc-300 bg-white relative"
                                            >
                                                {proj.coverImage ? (
                                                    <img
                                                        src={getImageUrl(proj.coverImage)}
                                                        alt={proj.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-zinc-500 p-1 text-center">
                                                        {proj.title}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTA Bas de carte */}
                        <div className="relative z-10 pt-6 border-t border-zinc-300 flex items-center justify-between gap-4">
                            <div>
                                <span className="block font-mono text-[11px] text-zinc-500 uppercase">
                                    MAQUETTES INTERACTIVES &amp; IDENTITÉS VISUELLES
                                </span>
                                <span className="text-sm font-semibold text-zinc-950">
                                    Explorer le Studio Design
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:bg-amber-600 group-hover:translate-x-1 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
