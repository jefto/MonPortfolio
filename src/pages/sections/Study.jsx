
// Données du parcours académique
const parcoursData = [
    {
        annee: "2023 - Actuellement",
        diplome: "Licence Professionnelle Génie Logiciel",
        etablissement: "École Polytechnique de Lomé",
        description: "Formation en développement logiciel, architecture et gestion de projets"
    },
    {
        annee: "2020 - 2023",
        diplome: "Lycée",
        etablissement: "C.S. La Promotion",
        description: "Mention Très Bien"
    },
    {
        annee: "2016 - 2020",
        diplome: "Collège",
        etablissement: "C.S. La Promotion",
        description: "Mention Bien"
    }
];

export default function Study() {
    return (
        <section className="px-8 md:px-16 py-16">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center font-abril">
                    Parcours <span className="text-blue-500">Académique</span>
                </h2>

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
            </div>
        </section>
    );
}