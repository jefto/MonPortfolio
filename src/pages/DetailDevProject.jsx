import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MatrixRain, TerminalWindow, GlowingCard, SectionTitle, AnimatedButton } from '../components/ui';
import { getProjectById, mapToDetailProject } from '../services/api';
import SEO from '../components/SEO';

export default function DetailDevProject() {
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
                    navigate('/dev');
                }
            }
        };
        fetchProject();
    }, [id, navigate]);

    if (error && error !== "Projet non trouvé") {
        return (
            <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">{`> Erreur: ${error}`}</p>
                    <p className="text-green-500/60 mb-6">{`> Vérifiez que le backend est lancé.`}</p>
                    <button
                        onClick={() => navigate('/dev')}
                        className="px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
                    >
                        Retour aux projets
                    </button>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
                <MatrixRain />
                <div className="text-center relative z-10">
                    <div className="animate-spin w-12 h-12 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-green-500/80">{`> Chargement du projet...`}</p>
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
        <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
            {project && (
                <SEO
                    title={`${project.name} — Projet Dev | TCHAMIE Jephte`}
                    description={project.description || `Détail du projet ${project.name} par TCHAMIE Jephte.`}
                    path={`/dev/project/${id}`}
                    image={project.coverImage}
                />
            )}
            <MatrixRain />

            {/* Grille de fond */}
            <div className="fixed inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="relative z-10 p-8 md:p-16">
                {/* Bouton Retour */}
                <button
                    onClick={() => navigate('/dev')}
                    className={`flex items-center gap-2 text-green-500/70 hover:text-green-400 transition-all duration-300 mb-8 group ${
                        isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                    }`}
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-mono text-sm">cd ../projects</span>
                </button>

                <div className="max-w-6xl mx-auto">
                    {/* Header du projet */}
                    <header className={`mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                        <GlowingCard className="p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                                <span className="text-green-500/70 text-sm uppercase">
                                    {project.type || "project"}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-green-400 mb-4 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                                <span className="text-green-600">{`> `}</span>{project.name}
                            </h1>
                            <p className="text-green-500/80 text-lg mb-6">
                                <span className="text-green-600">{`// `}</span>{project.description}
                            </p>

                            {/* Infos du projet */}
                            <TerminalWindow title="project-info.json">
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-green-600">client:</span> <span className="text-white">{project.client || "—"}</span></p>
                                    <p><span className="text-green-600">date:</span> <span className="text-white">{project.date || "—"}</span></p>
                                    <p><span className="text-green-600">type:</span> <span className="text-white">{project.type || "—"}</span></p>
                                    <p>
                                        <span className="text-green-600">technologies:</span>{' '}
                                        <span className="text-white">[{project.tools.map(t => `"${t}"`).join(', ')}]</span>
                                    </p>
                                </div>
                            </TerminalWindow>

                            {/* Lien vers le projet */}
                            {project.link && (
                                <div className="mt-6">
                                    <AnimatedButton href={project.link} text="Visiter le projet" />
                                </div>
                            )}
                        </GlowingCard>
                    </header>

                    {/* Galerie d'images / Screenshots */}
                    {project.gallery.length > 0 && (
                        <section className={`mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <SectionTitle command="ls ./screenshots" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                {project.gallery.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => openLightbox(index)}
                                        className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer
                                                   border border-green-500/30 hover:border-green-400 hover:shadow-xl
                                                   hover:shadow-green-500/20 transition-all duration-300"
                                    >
                                        <img
                                            src={image}
                                            alt={`${project.name} - Screenshot ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="text-green-400 font-mono text-sm">{`> open screenshot_${index + 1}`}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Description détaillée */}
                    <section className={`mb-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <SectionTitle command="cat README.md" />
                        <GlowingCard className="p-6 mt-4">
                            <p className="text-green-300/90 leading-relaxed">
                                <span className="text-green-500">{`>`}</span> {project.description}
                            </p>
                        </GlowingCard>
                    </section>
                </div>
            </div>

            {/* Lightbox pour les images */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-green-400 hover:text-green-300 transition-colors"
                    >
                        <FaTimes className="w-8 h-8" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="absolute left-4 text-green-400 hover:text-green-300 transition-colors"
                    >
                        <FaChevronLeft className="w-8 h-8" />
                    </button>

                    <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg border border-green-500/30"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="absolute right-4 text-green-400 hover:text-green-300 transition-colors"
                    >
                        <FaChevronRight className="w-8 h-8" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-green-400 font-mono">
                        [{currentImageIndex + 1}/{project.gallery.length}]
                    </div>
                </div>
            )}

            {/* Effet scanline */}
            <div className="fixed inset-0 pointer-events-none z-20 opacity-[0.03]"
                style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)' }}
            />
        </div>
    );
}

