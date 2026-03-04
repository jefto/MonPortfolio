import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Données des projets avec leurs galeries
const projectsDetails = {
    1: {
        id: 1,
        name: "App Mobile E-commerce",
        description: "Interface moderne pour une application de shopping avec une expérience utilisateur fluide et intuitive.",
        client: "Startup Fashion",
        date: "Juin 2024",
        category: "Mobile App Design",
        tools: ["Figma", "Adobe Illustrator", "Protopie"],
        gallery: [
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
            "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
            "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800",
            "https://images.unsplash.com/photo-1600267185393-e158a98703de?w=800",
            "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800"
        ],
        overview: "Ce projet visait à créer une expérience d'achat mobile moderne et engageante. L'interface a été conçue pour faciliter la navigation, améliorer la découverte de produits et simplifier le processus d'achat.",
        challenges: "Le principal défi était de créer une interface à la fois esthétique et performante, tout en respectant les meilleures pratiques UX pour le e-commerce mobile.",
        results: "L'application a reçu des retours très positifs lors des tests utilisateurs, avec un taux de satisfaction de 92% et une augmentation de 45% du taux de conversion."
    },
    2: {
        id: 2,
        name: "Site Web Portfolio",
        description: "Design élégant et minimaliste pour un portfolio d'artiste avec animations subtiles.",
        client: "Artiste Indépendant",
        date: "Mars 2024",
        category: "Web Design",
        tools: ["Figma", "Adobe Photoshop", "Framer"],
        gallery: [
            "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800",
            "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800",
            "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800",
            "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=800"
        ],
        overview: "Création d'un portfolio web élégant mettant en valeur les œuvres de l'artiste avec une approche minimaliste et des animations subtiles.",
        challenges: "Trouver le bon équilibre entre la mise en valeur des œuvres et une navigation intuitive, tout en gardant un design épuré.",
        results: "Le portfolio a permis à l'artiste d'augmenter sa visibilité en ligne de 300% et de décrocher plusieurs commissions importantes."
    },
    3: {
        id: 3,
        name: "Identité Visuelle",
        description: "Création d'une identité de marque complète : logo, charte graphique, supports de communication.",
        client: "Entreprise Tech",
        date: "Novembre 2023",
        category: "Branding",
        tools: ["Adobe Illustrator", "Adobe InDesign", "Figma"],
        gallery: [
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
            "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800",
            "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800",
            "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
            "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800"
        ],
        overview: "Développement d'une identité visuelle complète pour une entreprise tech, incluant logo, charte graphique, et déclinaisons sur tous les supports de communication.",
        challenges: "Créer une identité moderne qui reflète l'innovation tout en restant intemporelle et professionnelle.",
        results: "La nouvelle identité a permis à l'entreprise de se démarquer sur son marché et d'augmenter sa reconnaissance de marque de 65%."
    }
};

export default function DetailDesignProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const projectData = projectsDetails[id];
        if (projectData) {
            setProject(projectData);
            setIsLoaded(true);
        } else {
            navigate('/design');
        }
    }, [id, navigate]);

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center font-poppins">
                    <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du projet...</p>
                </div>
            </div>
        );
    }

    const openLightbox = (index) => {
        setSelectedImage(project.gallery[index]);
        setCurrentImageIndex(index);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        const nextIndex = (currentImageIndex + 1) % project.gallery.length;
        setSelectedImage(project.gallery[nextIndex]);
        setCurrentImageIndex(nextIndex);
    };

    const prevImage = () => {
        const prevIndex = (currentImageIndex - 1 + project.gallery.length) % project.gallery.length;
        setSelectedImage(project.gallery[prevIndex]);
        setCurrentImageIndex(prevIndex);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
            {/* Motifs décoratifs */}
            <div className="fixed inset-0 pointer-events-none opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full blur-3xl" />
                <div className="absolute top-40 right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl" />
                <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-blue-300 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 p-8 md:p-16">
                {/* Bouton Retour */}
                <button
                    onClick={() => navigate('/design')}
                    className={`flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-all duration-300 mb-8 group font-poppins ${
                        isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                    }`}
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-semibold">Retour aux projets</span>
                </button>

                <div className="max-w-6xl mx-auto">
                    {/* Header du projet */}
                    <header className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border-2 border-pink-200">
                            <div className="mb-4">
                                <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold rounded-full mb-4">
                                    {project.category}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-abril">
                                {project.name}
                            </h1>
                            <p className="text-xl text-gray-600 mb-6 font-poppins">
                                {project.description}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Client</p>
                                    <p className="text-gray-800 font-semibold">{project.client}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Date</p>
                                    <p className="text-gray-800 font-semibold">{project.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Outils utilisés</p>
                                    <p className="text-gray-800 font-semibold">{project.tools.join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Galerie d'images */}
                    <section className={`mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 font-abril">
                            <span className="text-pink-500">✦</span> Galerie du projet
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.gallery.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => openLightbox(index)}
                                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300"
                                >
                                    <img
                                        src={image}
                                        alt={`${project.name} - Aperçu ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Détails du projet */}
                    <section className={`mb-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border-2 border-pink-200 font-poppins">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-abril">
                                    <span className="text-pink-500">✦</span> Vue d'ensemble
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{project.overview}</p>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-abril">
                                    <span className="text-pink-500">✦</span> Défis rencontrés
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{project.challenges}</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-abril">
                                    <span className="text-pink-500">✦</span> Résultats
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{project.results}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Lightbox pour les images */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Bouton fermer */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-pink-400 transition-colors"
                    >
                        <FaTimes className="w-8 h-8" />
                    </button>

                    {/* Navigation précédent */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="absolute left-4 text-white hover:text-pink-400 transition-colors"
                    >
                        <FaChevronLeft className="w-8 h-8" />
                    </button>

                    {/* Image */}
                    <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Navigation suivant */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="absolute right-4 text-white hover:text-pink-400 transition-colors"
                    >
                        <FaChevronRight className="w-8 h-8" />
                    </button>

                    {/* Compteur d'images */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-poppins">
                        {currentImageIndex + 1} / {project.gallery.length}
                    </div>
                </div>
            )}
        </div>
    );
}