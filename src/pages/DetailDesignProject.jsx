import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getProjectById, mapToDetailProject } from '../services/api';
import SEO from '../components/SEO';

export default function DetailDesignProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setError(null);
                const data = await getProjectById(id);
                setProject(mapToDetailProject(data));
                setIsLoaded(true);
            } catch (err) {
                console.error("Erreur chargement projet:", err);
                setError(err.message);
                if (err.message === "Projet non trouvé") {
                    navigate('/design');
                }
            }
        };
        fetchProject();
    }, [id, navigate]);

    if (error && error !== "Projet non trouvé") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center font-poppins">
                    <p className="text-red-500 text-xl mb-4">Erreur : {error}</p>
                    <p className="text-gray-500 mb-6">Vérifiez que le backend est lancé.</p>
                    <button
                        onClick={() => navigate('/design')}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold"
                    >
                        Retour aux projets
                    </button>
                </div>
            </div>
        );
    }

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
            {project && (
                <SEO
                    title={`${project.name} — Projet Design | TCHAMIE Jephte`}
                    description={project.description || `Détail du projet design ${project.name} par TCHAMIE Jephte.`}
                    path={`/design/project/${id}`}
                    image={project.coverImage}
                />
            )}
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
                                    {project.type === "maquette" ? "Maquette" : project.type === "affiche" ? "Affiche" : project.category}
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
                                    <p className="text-gray-800 font-semibold">{project.client || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Date</p>
                                    <p className="text-gray-800 font-semibold">{project.date || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Outils utilisés</p>
                                    <p className="text-gray-800 font-semibold">{project.tools.length > 0 ? project.tools.join(', ') : "—"}</p>
                                </div>
                            </div>
                            {project.link && (
                                <div className="mt-6">
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
                                    >
                                        <span className="font-poppins">Voir le projet en ligne</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Galerie d'images */}
                    {project.gallery.length > 0 && (
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
                    )}

                    {/* Description détaillée */}
                    <section className={`mb-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border-2 border-pink-200 font-poppins">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-abril">
                                    <span className="text-pink-500">✦</span> Description du projet
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{project.description}</p>
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
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-pink-400 transition-colors"
                    >
                        <FaTimes className="w-8 h-8" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="absolute left-4 text-white hover:text-pink-400 transition-colors"
                    >
                        <FaChevronLeft className="w-8 h-8" />
                    </button>

                    <img
                        src={selectedImage}
                        alt={`${project.name} - Vue en grand`}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="absolute right-4 text-white hover:text-pink-400 transition-colors"
                    >
                        <FaChevronRight className="w-8 h-8" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-poppins">
                        {currentImageIndex + 1} / {project.gallery.length}
                    </div>
                </div>
            )}
        </div>
    );
}