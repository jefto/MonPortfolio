import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

export default function About() {
    const navigate = useNavigate();

    return (
        <section className="px-4 sm:px-8 md:px-16 py-20 bg-[#F3EFE6] border-b border-zinc-200">
            <SEO
                title="Profil & Méthodologie — TCHAMIE Jephte"
                description="Profil de TCHAMIE Jephte, ingénieur logiciel full-stack et UI/UX designer basé à Lomé, Togo. Expertise en React, Java, Spring Boot, PostgreSQL et Figma."
                path="/about"
            />
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Colonne Titre */}
                    <div className="lg:col-span-4">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-600 block mb-2">
                            03 // SYNTHÈSE &amp; MÉTHODOLOGIE
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 font-abril tracking-tight">
                            Approche Produit &amp; Ingénierie
                        </h2>
                        <p className="text-xs font-mono text-zinc-500 mt-3 uppercase">
                            DE LA RECHERCHE UTILISATEUR JUSQU’AU DÉPLOIEMENT CLOUD
                        </p>
                    </div>

                    {/* Colonne Contenu */}
                    <div className="lg:col-span-8 bg-white rounded-2xl p-7 sm:p-10 border border-zinc-200 font-poppins space-y-6">
                        <p className="text-zinc-800 text-base sm:text-lg leading-relaxed">
                            Basé à Lomé, j'interviens à l'intersection du{" "}
                            <strong className="font-semibold text-zinc-950">Génie Logiciel</strong> et du{" "}
                            <strong className="font-semibold text-zinc-950">Product Design</strong>. Cette double maîtrise permet d'éliminer la friction habituelle entre la conception sous Figma et l'implémentation technique.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200">
                                <span className="font-mono text-xs text-blue-600 font-semibold block mb-1">
                                    ARCHITECTURE &amp; BACKEND
                                </span>
                                <p className="text-sm text-zinc-700 leading-relaxed">
                                    Modélisation de données PostgreSQL, développement d'API REST sous Node.js/Express et Java/Spring Boot, authentification JWT et déploiement continu.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200">
                                <span className="font-mono text-xs text-amber-700 font-semibold block mb-1">
                                    SYSTÈMES D'INTERFACES &amp; BRANDING
                                </span>
                                <p className="text-sm text-zinc-700 leading-relaxed">
                                    Prototypage interactif haute-fidélité sur Figma, grilles typographiques structurées, composants React accessibles et supports de communication visuelle.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4">
                            <span className="font-mono text-xs text-zinc-500 uppercase">
                                INSPECTER LES RÉALISATIONS PAR DISCIPLINE
                            </span>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dev')}
                                    className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-mono uppercase tracking-wider rounded-lg transition-colors"
                                >
                                    Projets Engineering (/dev) →
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/design')}
                                    className="px-5 py-2.5 bg-white hover:bg-amber-500 text-zinc-950 border border-zinc-900 hover:border-amber-500 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors"
                                >
                                    Créations Design (/design) →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}