import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getVolunteerings, getImageUrl } from '../../services/api';

const FALLBACK_VOLUNTEERING = [
    {
        id: 'vol-1',
        title: 'Mentorat Technique & Initiation au Numérique',
        organization: 'Communautés Étudiantes & Jeunesse Tech',
        period: '2023 — Présent',
        location: 'Lomé, Togo',
        description:
            "Accompagnement bénévole d'étudiants et de jeunes passionnés dans l'apprentissage de la programmation, du design d'interfaces et de la méthodologie de projet.",
        imageUrl: '',
    },
    {
        id: 'vol-2',
        title: 'Bénévole & Coordinateur d’Actions Sociales',
        organization: 'Initiatives Citoyennes & Associatives',
        period: 'Depuis 2022',
        location: 'Lomé, Togo',
        description:
            "Participation active aux campagnes de sensibilisation, actions solidaires de terrain et mobilisation communautaire au service de l'entraide et du développement local.",
        imageUrl: '',
    },
    {
        id: 'vol-3',
        title: 'Direction Visuelle & Support Communication Bénévole',
        organization: 'Événements Culturels, Éducatifs & Sociaux',
        period: '2022 — Présent',
        location: 'Togo',
        description:
            "Conception bénévole de supports visuels, chartes graphiques et outils numériques pour donner de la visibilité aux associations et projets à impact positif.",
        imageUrl: '',
    },
];

export default function VolunteeringSection() {
    const [items, setItems] = useState(FALLBACK_VOLUNTEERING);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchItems = async () => {
            try {
                const data = await getVolunteerings();
                if (mounted && Array.isArray(data) && data.length > 0) {
                    setItems(data);
                }
            } catch (err) {
                console.error('Erreur chargement bénévolat:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchItems();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <section
            id="volunteering-section"
            className="relative px-4 sm:px-8 md:px-16 py-20 md:py-28 bg-[#FAF8F5] border-b border-zinc-200 overflow-hidden"
        >
            {/* Figures géométriques visibles en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <svg
                    className="absolute -left-20 -top-20 w-[460px] h-[460px] text-emerald-700/20"
                    viewBox="0 0 400 400"
                    fill="none"
                >
                    <circle cx="200" cy="200" r="175" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                    <circle cx="200" cy="200" r="125" stroke="currentColor" strokeWidth="1.5" />
                    <polygon points="200,35 365,200 200,365 35,200" stroke="currentColor" strokeWidth="1.4" />
                </svg>

                <svg
                    className="absolute -right-16 bottom-4 w-[380px] h-[380px] text-amber-600/20"
                    viewBox="0 0 320 320"
                    fill="none"
                >
                    <circle cx="160" cy="160" r="135" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
                    <rect x="65" y="65" width="190" height="190" rx="20" stroke="currentColor" strokeWidth="1.5" transform="rotate(18 160 160)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* En-tête éditorial & Manifeste Humain */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14 pb-8 border-b border-zinc-300">
                    <div className="lg:col-span-7">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-700 block mb-2.5">
                            03 // ENGAGEMENT SOCIAL, BÉNÉVOLAT &amp; COMMUNAUTÉ
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 font-abril tracking-tight leading-[1.12]">
                            Bien plus qu&apos;un ingénieur : une personne active dans les activités sociales.
                        </h2>
                    </div>

                    <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                        <p className="text-zinc-700 font-poppins text-sm sm:text-base leading-relaxed">
                            Au-delà de l&apos;architecture logicielle et du design d&apos;interfaces, je suis convaincu que le numérique et le leadership prennent tout leur sens sur le terrain humain : partage de connaissances, actions associatives et solidarité communautaire.
                        </p>
                    </div>
                </div>

                {/* Grille des activités de bénévolat */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-56 bg-zinc-200/60 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
                        {items.map((item, idx) => {
                            const resolvedImg = item.imageUrl ? getImageUrl(item.imageUrl) : '';

                            return (
                                <motion.article
                                    key={item.id || idx}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 140,
                                        damping: 22,
                                        delay: idx * 0.06,
                                    }}
                                    className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-950 transition-all overflow-hidden flex flex-col justify-between"
                                >
                                    <div>
                                        {resolvedImg && (
                                            <div className="h-48 overflow-hidden border-b border-zinc-200 bg-zinc-100">
                                                <img
                                                    src={resolvedImg}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                                <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 font-semibold">
                                                    {item.period}
                                                </span>
                                                <span className="font-mono text-xs text-zinc-400">
                                                    {item.location || 'Lomé, Togo'}
                                                </span>
                                            </div>

                                            <h3 className="text-lg sm:text-xl font-bold text-zinc-950 mb-1.5 leading-snug">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm font-semibold text-blue-600 mb-3">
                                                {item.organization}
                                            </p>

                                            {item.description && (
                                                <p className="text-zinc-600 text-sm leading-relaxed">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-6 py-3.5 bg-[#FAF8F5] border-t border-zinc-200/80 flex items-center justify-between font-mono text-[11px] text-zinc-500">
                                        <span>IMPACT COMMUNAUTAIRE</span>
                                        <span className="text-emerald-700 font-semibold">0{idx + 1}</span>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
