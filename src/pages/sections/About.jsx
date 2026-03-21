import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

export default function About() {
    const navigate = useNavigate();

    return (
        <section className="px-8 md:px-16 py-16 bg-gray-300">
            <SEO
                title="À Propos — TCHAMIE Jephte"
                description="Découvrez le profil de TCHAMIE Jephte, développeur web full-stack et UI/UX designer basé à Lomé, Togo. Expertise en React, Java, Spring Boot, Figma."
                path="/about"
            />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center font-abril">
                    À <span className="text-blue-500">Propos</span>
                </h2>

                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 font-poppins">
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        Passionné par la technologie et le design, je suis un
                        <span className="text-blue-600 font-semibold"> développeur web </span>
                        et <span className="text-blue-500 font-semibold">UI/UX designer</span> basé au Togo.
                    </p>

                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Je crée des expériences numériques uniques en combinant code et créativité.
                        Mon objectif est de transformer des idées en solutions digitales élégantes et fonctionnelles,
                        que ce soit à travers le développement d'applications web robustes ou la conception
                        d'interfaces utilisateur intuitives.
                    </p>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        Avec une expertise en <span className="text-blue-600 font-semibold">React, Java, Spring Boot</span> côté développement,
                        et <span className="text-blue-500 font-semibold">Figma</span> pour le design, je suis capable de mener
                        un projet de A à Z.
                    </p>

                    <div className="text-center">
                        <p className="text-gray-800 text-xl font-semibold mb-6">
                            Envie d'en savoir plus sur mes réalisations ?
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/dev')}
                                className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                Voir mes projets Dev
                            </button>

                            <button
                                onClick={() => navigate('/design')}
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Voir mes créations Design
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}