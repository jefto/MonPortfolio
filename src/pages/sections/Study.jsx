import { useState, useEffect } from 'react';
import { getEducations } from '../../services/api';
import SEO from '../../components/SEO';

const fallbackData = [
    {
        annee: "2023 — Actuellement",
        diplome: "Licence Professionnelle Génie Logiciel",
        etablissement: "École Polytechnique de Lomé",
        description: "Ingénierie logicielle, conception orientée objet, bases de données relationnelles et architectures distribuées."
    },
    {
        annee: "2020 — 2023",
        diplome: "Baccalauréat Scientifique (Série D)",
        etablissement: "C.S. La Promotion",
        description: "Cursus Mathématiques et Sciences Physiques / Biologie. Mention Très Bien."
    },
    {
        annee: "2016 — 2020",
        diplome: "Brevet d'Études du Premier Cycle",
        etablissement: "C.S. La Promotion",
        description: "Formation générale scientifique et littéraire. Mention Bien."
    }
];

const formatEducation = (edu) => ({
    annee: edu.endYear === null
        ? `${edu.startYear} — Actuellement`
        : `${edu.startYear} — ${edu.endYear}`,
    diplome: edu.title,
    etablissement: edu.school,
    description: edu.description || '',
});

export default function Study() {
    const [parcoursData, setParcoursData] = useState(fallbackData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEducations = async () => {
            try {
                const data = await getEducations();
                if (data && data.length > 0) {
                    setParcoursData(data.map(formatEducation));
                }
            } catch (err) {
                console.error("Erreur chargement parcours:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEducations();
    }, []);

    return (
        <section className="relative px-4 sm:px-8 md:px-16 py-20 bg-[#FAF8F5] border-b border-zinc-200 overflow-hidden">
            <SEO
                title="Formation Académique — TCHAMIE Jephte"
                description="Parcours académique de TCHAMIE Jephte : École Polytechnique de Lomé, Licence Professionnelle en Génie Logiciel."
                path="/skill"
            />
            {/* Figures géométriques en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <svg
                    className="absolute -right-12 bottom-[-15%] w-[420px] h-[420px] text-blue-600/20"
                    viewBox="0 0 400 400"
                    fill="none"
                >
                    <circle cx="200" cy="200" r="170" stroke="currentColor" strokeWidth="1.6" strokeDasharray="6 6" />
                    <circle cx="200" cy="200" r="115" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="85" y="85" width="230" height="230" stroke="currentColor" strokeWidth="1.4" transform="rotate(30 200 200)" />
                </svg>
                <svg
                    className="absolute left-8 top-8 w-52 h-52 text-zinc-900/15"
                    viewBox="0 0 200 200"
                    fill="none"
                >
                    <path d="M 0 40 L 200 40 M 40 0 L 40 200" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="40" cy="40" r="55" stroke="#d97706" strokeOpacity="0.4" strokeWidth="1.4" strokeDasharray="4 4" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12 pb-6 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-600 block mb-2">
                            04 // CURSUS ACADÉMIQUE
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 font-abril tracking-tight">
                            Formation &amp; Diplômes
                        </h2>
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                        ÉCOLE POLYTECHNIQUE DE LOMÉ (EPL)
                    </span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-44 bg-zinc-200/60 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
                        {parcoursData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 border border-zinc-200 hover:border-zinc-900 transition-colors flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <span className="inline-block px-3 py-1 bg-zinc-950 text-white text-xs font-mono rounded">
                                            {item.annee}
                                        </span>
                                        <span className="font-mono text-xs text-zinc-400">
                                            0{index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-950 mb-1.5">
                                        {item.diplome}
                                    </h3>
                                    <p className="text-blue-600 font-medium text-sm mb-3">
                                        {item.etablissement}
                                    </p>
                                </div>
                                {item.description && (
                                    <p className="text-zinc-600 text-sm leading-relaxed pt-3 border-t border-zinc-100">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}