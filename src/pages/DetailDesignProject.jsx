import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getProjectById, mapToDetailProject } from '../services/api';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';

export default function DetailDesignProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setError(null);
                const data = await getProjectById(id);
                setProject(mapToDetailProject(data));
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
            <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
                <Navbar variant="light" />
                <div className="max-w-3xl mx-auto px-6 py-24 text-center font-poppins">
                    <p className="text-red-600 text-lg mb-3">Erreur : {error}</p>
                    <p className="text-zinc-500 text-sm mb-6">Vérifiez que le serveur API est disponible.</p>
                    <button
                        onClick={() => navigate('/design')}
                        className="px-5 py-2.5 bg-zinc-950 text-white rounded-lg font-code text-xs uppercase tracking-wider"
                    >
                        Retour au catalogue Design
                    </button>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
                <Navbar variant="light" />
                <div className="flex items-center justify-center py-32">
                    <div className="text-center font-code">
                        <div className="animate-spin w-8 h-8 border-2 border-zinc-950 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-zinc-500 text-xs uppercase tracking-widest">Chargement de l&apos;étude visuelle...</p>
                    </div>
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
        <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
            <SEO
                title={`${project.name} — Étude Design | TCHAMIE Jephte`}
                description={project.description || `Détail du projet design ${project.name} par TCHAMIE Jephte.`}
                path={`/design/project/${id}`}
                image={project.coverImage}
            />
            <Navbar variant="light" />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <button
                    onClick={() => navigate('/design')}
                    className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 font-code text-xs uppercase tracking-widest mb-8 transition-colors"
                >
                    <span>←</span>
                    <span>Retour au Studio Design</span>
                </button>

                {/* Project Header */}
                <header className="bg-white border border-zinc-200 rounded-2xl p-8 md:p-12 mb-12">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-800 font-code text-xs uppercase tracking-widest rounded">
                            {project.type === "maquette" ? "Système UI/UX & Maquette" : project.type === "affiche" ? "Direction Artistique & Affiche" : project.category}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-abril text-zinc-950 mb-4 tracking-tight">
                        {project.name}
                    </h1>
                    <p className="text-base sm:text-lg text-zinc-600 mb-8 font-poppins leading-relaxed max-w-3xl">
                        {project.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-200 font-poppins">
                        <div>
                            <p className="font-code text-[11px] uppercase tracking-widest text-zinc-400 mb-1">Client / Organisation</p>
                            <p className="text-zinc-900 font-semibold text-sm">{project.client || "Projet Studio"}</p>
                        </div>
                        <div>
                            <p className="font-code text-[11px] uppercase tracking-widest text-zinc-400 mb-1">Période</p>
                            <p className="text-zinc-900 font-semibold text-sm">{project.date || "—"}</p>
                        </div>
                        <div>
                            <p className="font-code text-[11px] uppercase tracking-widest text-zinc-400 mb-1">Outils de conception</p>
                            <p className="text-zinc-900 font-semibold text-sm">{project.tools.length > 0 ? project.tools.join(', ') : "Figma, Suite Adobe"}</p>
                        </div>
                    </div>

                    {project.link && (
                        <div className="mt-8 pt-6 border-t border-zinc-100">
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-950 hover:bg-amber-600 text-white font-code text-xs uppercase tracking-widest rounded-lg transition-colors"
                            >
                                <span>Ouvrir le livrable en ligne</span>
                                <span>↗</span>
                            </a>
                        </div>
                    )}
                </header>

                {/* Gallery */}
                {project.gallery.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <span className="font-code text-xs uppercase tracking-widest text-amber-700 block mb-1">
                                    01 // PLANCHES VISUELLES
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-abril text-zinc-950">
                                    Galerie haute résolution ({project.gallery.length})
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.gallery.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => openLightbox(index)}
                                    className="group relative aspect-video bg-white rounded-xl overflow-hidden cursor-pointer border border-zinc-200 hover:border-zinc-950 transition-all"
                                >
                                    <img
                                        src={image}
                                        alt={`${project.name} - Planche ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-zinc-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="px-3 py-1.5 bg-white text-zinc-950 font-code text-xs uppercase tracking-wider rounded">
                                            Agrandir [{index + 1}/{project.gallery.length}]
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Detailed Notes */}
                <section className="bg-white border border-zinc-200 rounded-2xl p-8 md:p-10 font-poppins">
                    <span className="font-code text-xs uppercase tracking-widest text-amber-700 block mb-2">
                        02 // NOTE D&apos;INTENTION
                    </span>
                    <h3 className="text-2xl font-abril text-zinc-950 mb-4">
                        Synthèse créative
                    </h3>
                    <p className="text-zinc-700 leading-relaxed text-base">
                        {project.description}
                    </p>
                </section>
            </main>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-zinc-950/95 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
                        aria-label="Fermer"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="absolute left-6 text-zinc-400 hover:text-white transition-colors"
                        aria-label="Image précédente"
                    >
                        <FaChevronLeft className="w-7 h-7" />
                    </button>

                    <img
                        src={selectedImage}
                        alt={`${project.name} - Vue plein écran`}
                        className="max-w-full max-h-[85vh] object-contain rounded border border-zinc-800"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="absolute right-6 text-zinc-400 hover:text-white transition-colors"
                        aria-label="Image suivante"
                    >
                        <FaChevronRight className="w-7 h-7" />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-300 font-code text-xs tracking-widest">
                        {currentImageIndex + 1} / {project.gallery.length}
                    </div>
                </div>
            )}
        </div>
    );
}