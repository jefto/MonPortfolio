import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getExperiences, getProjects, getImageUrl } from '../../services/api';

const EMPLOYMENT_LABELS = {
    FULL_TIME: 'Temps plein',
    PART_TIME: 'Temps partiel',
};

const WORK_MODE_LABELS = {
    ONSITE: 'En présentiel',
    REMOTE: 'En ligne',
    HYBRID: 'Hybride',
};

const FALLBACK_EXPERIENCES = [
    {
        id: 'fallback-1',
        title: 'Ingénieur Full-Stack & UI/UX Product Designer',
        company: 'Projets Clients & Studio Indépendant — Lomé',
        startDate: 'Janvier 2024',
        endDate: null,
        isCurrent: true,
        metrics: {
            impactScore: 92,
            employmentType: 'FULL_TIME',
            workMode: 'HYBRID',
        },
    },
    {
        id: 'fallback-2',
        title: 'Développeur Logiciel & Concepteur d’Interfaces',
        company: 'École Polytechnique de Lomé — Projets & Recherche',
        startDate: 'Octobre 2023',
        endDate: null,
        isCurrent: true,
        metrics: {
            impactScore: 80,
            employmentType: 'PART_TIME',
            workMode: 'ONSITE',
        },
    },
    {
        id: 'fallback-3',
        title: 'UI/UX & Graphic Designer',
        company: 'Collaborations Créatives & Événementiel Tech',
        startDate: 'Mars 2022',
        endDate: 'Décembre 2023',
        isCurrent: false,
        metrics: {
            impactScore: 68,
            employmentType: 'PART_TIME',
            workMode: 'REMOTE',
        },
    },
];

function computeBarPercent(exp, index) {
    if (exp?.metrics?.impactScore) return exp.metrics.impactScore;
    if (exp?.isCurrent) return 92;
    return Math.max(50, 90 - index * 12);
}

function formatPeriod(exp) {
    if (!exp) return '';
    const start = exp.startDate || '—';
    const end = exp.isCurrent ? 'Présent' : exp.endDate || '—';
    if (start.includes('—')) return start;
    return `${start} — ${end}`;
}

export default function ExperienceSpectrumSection() {
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState([]);
    const [designProjects, setDesignProjects] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [lightboxItem, setLightboxItem] = useState(null);

    useEffect(() => {
        let mounted = true;
        const loadData = async () => {
            try {
                setLoading(true);
                const [expList, desProjs] = await Promise.all([
                    getExperiences().catch(() => []),
                    getProjects({ category: 'projet-design' }).catch(() => []),
                ]);
                if (!mounted) return;
                setDesignProjects(desProjs || []);
                if (expList && expList.length > 0) {
                    setExperiences(expList);
                } else {
                    setExperiences(FALLBACK_EXPERIENCES);
                }
            } catch {
                if (mounted) setExperiences(FALLBACK_EXPERIENCES);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        loadData();
        return () => {
            mounted = false;
        };
    }, []);

    const activeExp = experiences[activeIndex] || experiences[0] || FALLBACK_EXPERIENCES[0];

    const resolvedDesignWorks =
        designProjects.length > 0
            ? designProjects.slice(0, 4).map((proj) => ({
                  id: proj.id,
                  title: proj.title,
                  category: proj.type === 'maquette' ? 'Maquette UI/UX' : 'Affiche & Identité',
                  resolvedImage: getImageUrl(proj.coverImage),
                  link: proj.type === 'maquette' && proj.link ? proj.link : `/design/project/${proj.id}`,
                  client: proj.client,
              }))
            : [
                  {
                      id: 'spec-1',
                      title: 'Système UI/UX & Maquettes Figma',
                      category: 'Maquette UI/UX',
                      resolvedImage: '',
                      link: '/design',
                  },
                  {
                      id: 'spec-2',
                      title: 'Direction Artistique & Identités Visuelles',
                      category: 'Affiche & Branding',
                      resolvedImage: '',
                      link: '/design',
                  },
              ];

    return (
        <section
            id="experience-spectrum"
            className="relative px-4 sm:px-8 md:px-16 py-20 md:py-28 bg-white border-b border-zinc-200 overflow-hidden"
        >
            {/* Figures géométriques en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <svg
                    className="absolute -right-20 -top-20 w-[520px] h-[520px] text-zinc-900/15"
                    viewBox="0 0 400 400"
                    fill="none"
                >
                    <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
                    <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="200" cy="200" r="80" stroke="#2563eb" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="1.2" />
                </svg>

                <svg
                    className="absolute -left-16 bottom-6 w-[380px] h-[380px] text-amber-600/25"
                    viewBox="0 0 300 300"
                    fill="none"
                >
                    <rect x="40" y="40" width="220" height="220" rx="24" stroke="currentColor" strokeWidth="1.8" transform="rotate(12 150 150)" />
                    <rect x="70" y="70" width="160" height="160" rx="16" stroke="currentColor" strokeWidth="1.5" transform="rotate(-8 150 150)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* En-tête de section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b border-zinc-200 gap-6">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-600 block mb-2">
                            02 // PARCOURS &amp; CRÉATIONS SUR LE MÊME PLAN
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight font-abril">
                            Postes Occupés &amp; Travaux Design
                        </h2>
                    </div>
                    <p className="text-sm text-zinc-600 max-w-md font-poppins">
                        Visualisation de mes différents postes sous forme d&apos;histogramme interactif, mis sur le même plan que mes réalisations en UI/UX et Design Graphique.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-96">
                        <div className="lg:col-span-6 bg-zinc-100 rounded-2xl animate-pulse" />
                        <div className="lg:col-span-6 bg-zinc-100 rounded-2xl animate-pulse" />
                    </div>
                ) : (
                    /* MISE SUR LE MÊME PLAN (50% HISTOGRAMME DES POSTES / 50% TRAVAUX DESIGN) */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        {/* VOLET GAUCHE (6/12) : HISTOGRAMME INTERACTIF DES POSTES OCCUPÉS */}
                        <div className="lg:col-span-6 bg-[#FAF8F5] rounded-2xl border border-zinc-200 p-6 sm:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-zinc-200">
                                    <div>
                                        <span className="font-mono text-[11px] uppercase tracking-widest text-blue-600 block">
                                            AXE 01 // EXPÉRIENCES &amp; RÔLES
                                        </span>
                                        <h3 className="text-xl font-bold text-zinc-950 mt-0.5 font-poppins">
                                            Histogramme des Postes Occupés
                                        </h3>
                                    </div>
                                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-950 text-white">
                                        {experiences.length} {experiences.length > 1 ? 'POSTES' : 'POSTE'}
                                    </span>
                                </div>

                                {/* Barres de l'Histogramme */}
                                <div className="space-y-4">
                                    {experiences.map((exp, idx) => {
                                        const isSelected = idx === activeIndex;
                                        const periodText = formatPeriod(exp);
                                        const barPercent = computeBarPercent(exp, idx);
                                        const empLabel = EMPLOYMENT_LABELS[exp.metrics?.employmentType] || 'Temps plein';
                                        const modeLabel = WORK_MODE_LABELS[exp.metrics?.workMode] || 'En présentiel';

                                        return (
                                            <motion.button
                                                key={exp.id || idx}
                                                type="button"
                                                onClick={() => setActiveIndex(idx)}
                                                whileHover={{ x: 3 }}
                                                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                                                className={`w-full text-left rounded-xl p-5 border transition-all ${
                                                    isSelected
                                                        ? 'bg-white border-zinc-950 shadow-md ring-1 ring-zinc-950'
                                                        : 'bg-white/75 border-zinc-200 hover:border-zinc-400 hover:bg-white'
                                                }`}
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="font-mono text-[11px] text-zinc-400 mr-1">
                                                            0{idx + 1}
                                                        </span>
                                                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-medium">
                                                            {empLabel}
                                                        </span>
                                                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                                                            {modeLabel}
                                                        </span>
                                                        {exp.isCurrent && (
                                                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 font-semibold">
                                                                En poste
                                                            </span>
                                                        )}
                                                    </div>

                                                    <span
                                                        className={`font-mono text-xs px-2.5 py-0.5 rounded font-semibold ${
                                                            isSelected
                                                                ? 'bg-zinc-950 text-white'
                                                                : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                                                        }`}
                                                    >
                                                        {periodText}
                                                    </span>
                                                </div>

                                                <h4 className="text-base sm:text-lg font-bold text-zinc-950 font-poppins">
                                                    {exp.title}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-blue-600 font-medium mt-0.5 mb-3">
                                                    {exp.company}
                                                </p>

                                                {/* Barre d'Histogramme Horizontale */}
                                                <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200/80">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${barPercent}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 120,
                                                            damping: 22,
                                                            delay: idx * 0.06,
                                                        }}
                                                        className={`h-full rounded-full ${
                                                            isSelected
                                                                ? 'bg-gradient-to-r from-zinc-950 via-blue-600 to-amber-500'
                                                                : 'bg-zinc-800'
                                                        }`}
                                                    />
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Détail du poste actif en bas du volet gauche */}
                            {activeExp && (
                                <div className="mt-6 pt-5 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 block">
                                            POSTE SÉLECTIONNÉ
                                        </span>
                                        <p className="text-sm font-bold text-zinc-950">
                                            {activeExp.title} — <span className="text-blue-600">{activeExp.company}</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-xs px-2.5 py-1 rounded bg-zinc-200/80 text-zinc-800">
                                            {EMPLOYMENT_LABELS[activeExp.metrics?.employmentType] || 'Temps plein'} ·{' '}
                                            {WORK_MODE_LABELS[activeExp.metrics?.workMode] || 'En présentiel'}
                                        </span>
                                        <span className="font-mono text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/30 font-semibold">
                                            {formatPeriod(activeExp)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* VOLET DROIT (6/12) : TRAVAUX DESIGN SUR LE MÊME PLAN */}
                        <div className="lg:col-span-6 bg-zinc-950 text-zinc-100 rounded-2xl border border-zinc-900 p-6 sm:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-zinc-800">
                                    <div>
                                        <span className="font-mono text-[11px] uppercase tracking-widest text-amber-400 block">
                                            AXE 02 // STUDIO CRÉATIF &amp; UI/UX
                                        </span>
                                        <h3 className="text-xl font-bold text-white mt-0.5 font-poppins">
                                            Travaux Design sur le Même Plan
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/design')}
                                        className="px-3.5 py-1.5 rounded-lg border border-zinc-700 hover:border-amber-400 text-xs font-mono text-zinc-300 hover:text-amber-400 transition-colors"
                                    >
                                        Tout le Studio Design →
                                    </button>
                                </div>

                                {/* Grille des créations Design */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {resolvedDesignWorks.map((work, wIdx) => (
                                        <div
                                            key={work.id || wIdx}
                                            className="group bg-zinc-900 border border-zinc-800 hover:border-amber-500/60 rounded-xl overflow-hidden flex flex-col justify-between transition-all"
                                        >
                                            <div
                                                onClick={() => {
                                                    if (work.resolvedImage) {
                                                        setLightboxItem(work);
                                                    } else if (work.link) {
                                                        if (work.link.startsWith('http')) {
                                                            window.open(work.link, '_blank');
                                                        } else {
                                                            navigate(work.link);
                                                        }
                                                    }
                                                }}
                                                className="relative h-44 bg-zinc-950 overflow-hidden cursor-pointer border-b border-zinc-800"
                                            >
                                                {work.resolvedImage ? (
                                                    <img
                                                        src={work.resolvedImage}
                                                        alt={work.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full p-5 flex flex-col justify-between bg-zinc-950 relative">
                                                        <div
                                                            className="absolute inset-0 opacity-20"
                                                            style={{
                                                                backgroundImage:
                                                                    'radial-gradient(#f59e0b 1px, transparent 1px)',
                                                                backgroundSize: '16px 16px',
                                                            }}
                                                        />
                                                        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-zinc-500">
                                                            <span>FIGMA // SPEC 0{wIdx + 1}</span>
                                                            <span className="text-amber-400">UI/UX</span>
                                                        </div>
                                                        <div className="relative z-10 my-auto border border-zinc-800 bg-zinc-900/90 rounded p-3">
                                                            <div className="flex gap-1.5 mb-2">
                                                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                                                            </div>
                                                            <div className="h-2 w-2/3 bg-zinc-700 rounded mb-1.5" />
                                                            <div className="h-2 w-1/2 bg-zinc-800 rounded" />
                                                        </div>
                                                        <div className="relative z-10 font-mono text-[10px] text-zinc-400">
                                                            Inspecter le design →
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="absolute top-2.5 left-2.5">
                                                    <span className="px-2.5 py-1 rounded bg-zinc-950/85 backdrop-blur-sm border border-zinc-700 font-mono text-[10px] text-amber-400">
                                                        {work.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-4 flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h5 className="font-semibold text-sm text-white truncate">
                                                        {work.title}
                                                    </h5>
                                                    {work.client && (
                                                        <p className="text-xs text-zinc-400 truncate">
                                                            {work.client}
                                                        </p>
                                                    )}
                                                </div>

                                                {work.link && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (work.link.startsWith('http')) {
                                                                window.open(work.link, '_blank');
                                                            } else {
                                                                navigate(work.link);
                                                            }
                                                        }}
                                                        className="p-2 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 transition-colors flex-shrink-0"
                                                        title="Ouvrir la réalisation"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pied du volet Design */}
                            <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                                <span className="text-xs text-zinc-400 font-mono">
                                    Systèmes UI/UX, prototypes Figma &amp; créations graphiques
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dev')}
                                        className="text-xs font-mono text-emerald-400 hover:underline"
                                    >
                                        Projets Dev →
                                    </button>
                                    <span className="text-zinc-700">|</span>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/design')}
                                        className="text-xs font-mono text-amber-400 hover:underline"
                                    >
                                        Projets Design →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox d'inspection visuelle */}
            <AnimatePresence>
                {lightboxItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxItem(null)}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                                <div>
                                    <span className="font-mono text-xs text-amber-400 block">
                                        {lightboxItem.category}
                                    </span>
                                    <h4 className="text-white font-bold text-lg">{lightboxItem.title}</h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setLightboxItem(null)}
                                    className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono"
                                >
                                    FERMER [ESC]
                                </button>
                            </div>
                            <div className="p-4 bg-black flex items-center justify-center max-h-[75vh] overflow-auto">
                                <img
                                    src={lightboxItem.resolvedImage}
                                    alt={lightboxItem.title}
                                    className="max-h-[70vh] w-auto object-contain rounded"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
