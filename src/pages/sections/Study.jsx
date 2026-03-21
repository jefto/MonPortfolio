import { useState, useEffect } from 'react';
import { getEducations } from '../../services/api';
import SEO from '../../components/SEO';

// Données statiques de fallback (utilisées si l'API échoue)
const fallbackData = [
    {
        annee: "2023 - Actuellement",
        diplome: "Licence Professionnelle Génie Logiciel",
        etablissement: "École Polytechnique de Lomé",
        description: "Formation en architecture et développement de logiciel"
    },
    {
        annee: "2020 - 2023",
        diplome: "Lycée",
        etablissement: "C.S. La Promotion",
        description: "Parcours Mathématique et Biologie. Mention Très Bien"
    },
    {
        annee: "2016 - 2020",
        diplome: "Collège",
        etablissement: "C.S. La Promotion",
        description: "Parcours Général. Mention Bien"
    }
];

const formatEducation = (edu) => ({
    annee: edu.endYear === null
        ? `${edu.startYear} - Actuellement`
        : `${edu.startYear} - ${edu.endYear}`,
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
                // Garder les données de fallback
            } finally {
                setLoading(false);
            }
        };
        fetchEducations();
    }, []);

    return (
        <section className="px-8 md:px-16 py-16">
            <SEO
                title="Parcours Académique — TCHAMIE Jephte"
                description="Parcours académique de TCHAMIE Jephte : École Polytechnique de Lomé, formation en génie logiciel et développement web."
                path="/skill"
            />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center font-abril">
                    Parcours <span className="text-blue-500">Académique</span>
                </h2>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Chargement du parcours...</p>
                    </div>
                ) : (
                <div className="relative font-poppins">
                    {/* Ligne verticale */}
                    <div className="absolute left-4  md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-500" />

                    {parcoursData.map((item, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                                index % 2 === 0 ? 'md:flex-row-reverse' : ''
                            }`}
                        >
                            {/* Point sur la timeline */}
                            <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 border-4 border-white shadow-md shadow-blue-500/50" />

                            {/* Contenu */}
                            <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                                <div className="bg-white rounded-xl p-6 m-10 shadow-lg shadow-blue-500/20 border border-gray-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                                    <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full mb-3">
                                        {item.annee}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {item.diplome}
                                    </h3>
                                    <p className="text-blue-600 font-semibold mb-2">
                                        {item.etablissement}
                                    </p>
                                    <p className="text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </section>
    );
}