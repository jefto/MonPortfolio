import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from "@emailjs/browser";
import {
    MatrixRain,
    TerminalText,
    SkillCard,
    ProjectCard,
    SectionTitle,
    TerminalWindow,
    GlowingCard,
    FormInput,
    AnimatedButton
} from '../components/ui';
import { getProjects, mapToDevProject, getSkills, groupDevSkills, getStatistics } from '../services/api';
import SEO from '../components/SEO';

// ============================================
// DONNÉES - Modifier ici pour personnaliser
// ============================================

// Commandes terminal pour chaque navigation
const navigationCommands = {
    back: [
        "$ cd ..",
        "Retour au répertoire précédent...",
        "Navigation en cours...",
        "> Redirection..."
    ],
    home: [
        "$ cd ~",
        "$ clear",
        "Retour au répertoire racine...",
        "> Chargement de la page d'accueil..."
    ],
    design: [
        "$ cd ~/design",
        "$ ls -la",
        "Chargement des assets design...",
        "> Ouverture du portfolio design..."
    ]
};

// Catégories de projets disponibles
const projectCategories = [
    { id: "all", label: "Tous" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "fullstack", label: "Fullstack" },
    { id: "mobile", label: "Mobile" },
    { id: "desktop", label: "Desktop" }
];

// Les compétences sont maintenant chargées depuis l'API backend

// Les projets sont maintenant chargés depuis l'API backend

// Les statistiques sont maintenant chargées depuis l'API backend

// Informations de contact
const contactInfo = {
    email: "jefftchamie@gmail.com",
    location: "Lomé, TOGO",
    phone: "+228 91020171"
};

// Réseaux sociaux
const socialLinks = [
    { name: "GitHub", url: "https://github.com/jefto", icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/jefto2/", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
    { name: "Instagram", url: "https://www.instagram.com/jefto2.0/", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
    { name: "WhatsApp", url: "https://wa.me/22891020171", icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
    { name: "Twitter/X", url: "https://x.com/putamadre2_0", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }
];

// Champs du formulaire de contact
const formFields = [
    { label: "Nom complet", name: "name", type: "text", placeholder: "John Doe", required: true },
    { label: "Email", name: "email", type: "email", placeholder: "john@example.com", required: true },
    { label: "Sujet", name: "title", type: "text", placeholder: "Projet de collaboration...", required: false },
    { label: "Message", name: "message", type: "textarea", placeholder: "Décrivez votre projet ou votre demande...", rows: 5, required: true }
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function DevPart() {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isNavigating, setIsNavigating] = useState(false);
    const [navigationData, setNavigationData] = useState({ type: '', destination: '' });
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const formRef = useRef();
    const [buttonState, setButtonState] = useState('idle');

    // État pour les projets chargés depuis l'API
    const [projectsData, setProjectsData] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState(null);

    // État pour les compétences chargées depuis l'API
    const [skillsData, setSkillsData] = useState({ langages: [], frameworks: [], databases: [], outils: [] });
    const [skillsLoading, setSkillsLoading] = useState(true);

    // État pour les statistiques chargées depuis l'API
    const [statsData, setStatsData] = useState([
        { label: "Projets complétés", value: "..." },
        { label: "Années d'expérience", value: "..." },
        { label: "Technologies maîtrisées", value: "..." },
        { label: "Cafés consommés", value: "∞" }
    ]);

    // Charger les projets dev depuis l'API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjectsLoading(true);
                setProjectsError(null);
                const projects = await getProjects({ category: "projet-dev" });
                setProjectsData(projects.map(mapToDevProject));
            } catch (err) {
                console.error("Erreur chargement projets dev:", err);
                setProjectsError(err.message);
            } finally {
                setProjectsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Charger les compétences dev depuis l'API
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setSkillsLoading(true);
                const skills = await getSkills({ category: "dev" });
                setSkillsData(groupDevSkills(skills));
            } catch (err) {
                console.error("Erreur chargement compétences dev:", err);
            } finally {
                setSkillsLoading(false);
            }
        };
        fetchSkills();
    }, []);

    // Charger les statistiques depuis l'API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStatistics();
                if (data) {
                    setStatsData([
                        { label: "Projets complétés", value: `${data.completedProjects}+` },
                        { label: "Années d'expérience", value: `${data.yearsExperience}+` },
                        { label: "Technologies maîtrisées", value: `${data.masteredTechnologies}+` },
                        { label: "Cafés consommés", value: "∞" }
                    ]);
                }
            } catch (err) {
                console.error("Erreur chargement statistiques:", err);
            }
        };
        fetchStats();
    }, []);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setButtonState('sending');

        emailjs
            .sendForm(
                'service_wey3t6a',
                'template_po86ns4',
                formRef.current,
                'JoxxtCta16gAIhrX7'
            )
            .then(
                (result) => {
                    console.log('Email envoyé avec succès :', result.text);
                    setButtonState('sent');
                    formRef.current.reset();
                    setTimeout(() => setButtonState('idle'), 3000);
                },
                (error) => {
                    console.error('Erreur lors de l\'envoi de l\'email :', error.text);
                    setButtonState('error');
                    setTimeout(() => setButtonState('idle'), 3000);
                }
            );
    };

    const buttonConfig = {
        idle: { text: 'Envoyer le message', disabled: false },
        sending: { text: 'Envoi en cours...', disabled: true },
        sent: { text: '✓ Message envoyé !', disabled: true },
        error: { text: '✗ Échec de l\'envoi', disabled: true },
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Animation du terminal lors de la navigation
    useEffect(() => {
        if (!isNavigating || !navigationData.type) return;

        const commands = navigationCommands[navigationData.type] || [];

        if (currentLineIndex < commands.length) {
            const timer = setTimeout(() => {
                setCurrentLineIndex(prev => prev + 1);
            }, 400);
            return () => clearTimeout(timer);
        } else if (currentLineIndex >= commands.length) {
            // Navigation après l'animation
            const timer = setTimeout(() => {
                if (navigationData.destination === 'back') {
                    navigate(-1);
                } else {
                    navigate(navigationData.destination);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isNavigating, currentLineIndex, navigationData, navigate]);

    // Fonction pour déclencher la navigation avec animation
    const handleNavigation = (type, destination) => {
        setNavigationData({ type, destination });
        setCurrentLineIndex(0);
        setIsNavigating(true);
    };

    // Filtrer et trier les projets (plus récents en premier)
    const filteredProjects = projectsData
        .filter(project => selectedCategory === "all" || project.category === selectedCategory)
        .sort((a, b) => b.date.localeCompare(a.date));

    // Fonction pour rendre une catégorie de compétences
    const renderSkillCategory = (title, skills) => (
        <div className="mb-8">
            <h3 className="text-xl text-green-300 mb-4 flex items-center gap-2">
                <span className="text-green-600">{`>`}</span> {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((item, index) => (
                    <SkillCard key={index} skill={item.skill} level={item.level} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
            <SEO
                title="Projets Développement — TCHAMIE Jephte"
                description="Découvrez les projets de développement web de TCHAMIE Jephte : React, Node.js, Java, Spring Boot, applications fullstack, frontend et backend."
                path="/dev"
            />
            <MatrixRain />

            {/* Grille de fond */}
            <div className="fixed inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="relative z-10 p-4 sm:p-8 md:p-16">
                {/* Bouton Retour en haut */}
                <button
                    onClick={() => handleNavigation('back', 'back')}
                    className="flex items-center gap-2 text-green-500/70 hover:text-green-400
                               transition-colors duration-300 mb-6 group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-mono text-sm">Retour</span>
                </button>

                {/* Header */}
                <header className={`mb-10 md:mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                        <span className="text-green-500/70 text-sm">SYSTEM ONLINE</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-green-400 mb-4 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                        <TerminalText text="DÉVELOPPEUR WEB" delay={80} />
                    </h1>
                    <p className="text-green-500/80 text-base sm:text-lg md:text-xl max-w-2xl">
                        <span className="text-green-600">{`// `}</span>
                        Passionné par le code, créateur de solutions numériques
                    </p>
                </header>

                {/* Section À propos */}
                <section className={`mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <SectionTitle command="whoami" />
                    <GlowingCard className="p-6 ml-6 border-l-2 border-green-500/50">
                        <p className="text-green-300/90 leading-relaxed">
                            <span className="text-green-500">{`>`}</span> Développeur Full Stack passionné par les technologies web modernes.<br />
                            <span className="text-green-500">{`>`}</span> Spécialisé en JavaScript, Java.<br />
                            <span className="text-green-500">{`>`}</span> Toujours en quête d'innovation et de performance.
                        </p>
                    </GlowingCard>
                </section>

                {/* Section Compétences */}
                <section className={`mb-16 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <SectionTitle command="cat skills.json" />
                    {skillsLoading ? (
                        <div className="text-center py-8 text-green-500/60">
                            <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-3" />
                            <p>{`> Chargement des compétences...`}</p>
                        </div>
                    ) : (
                        <>
                            {skillsData.langages.length > 0 && renderSkillCategory("Langages", skillsData.langages)}
                            {skillsData.frameworks.length > 0 && renderSkillCategory("Frameworks", skillsData.frameworks)}
                            {skillsData.databases.length > 0 && renderSkillCategory("Bases de données", skillsData.databases)}
                            {skillsData.outils.length > 0 && renderSkillCategory("Outils", skillsData.outils)}
                            {skillsData.langages.length === 0 && skillsData.frameworks.length === 0 &&
                             skillsData.databases.length === 0 && skillsData.outils.length === 0 && (
                                <p className="text-green-500/60 text-center py-4">{`> Aucune compétence enregistrée`}</p>
                            )}
                        </>
                    )}
                </section>

                {/* Section Projets */}
                <section className={`mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <SectionTitle command="ls ./projects" />

                    {/* Filtres par catégorie */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {projectCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300
                                    ${selectedCategory === category.id
                                        ? 'bg-green-500 text-black border border-green-500'
                                        : 'bg-transparent text-green-400 border border-green-500/30 hover:border-green-400 hover:bg-green-900/30'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Grille des projets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsLoading ? (
                            <div className="col-span-full text-center py-12 text-green-500/60">
                                <div className="animate-spin w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
                                <p className="text-lg">{`> Chargement des projets...`}</p>
                            </div>
                        ) : projectsError ? (
                            <div className="col-span-full text-center py-12 text-red-400">
                                <p className="text-lg">{`> Erreur: ${projectsError}`}</p>
                                <p className="text-sm mt-2 text-green-500/60">{`> Vérifiez que le backend est lancé sur ${process.env.REACT_APP_API_URL || 'http://localhost:3000'}`}</p>
                            </div>
                        ) : filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-green-500/60">
                                <p className="text-lg">Aucun projet dans cette catégorie</p>
                                <p className="text-sm mt-2">{`> Sélectionnez une autre catégorie`}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Section Stats */}
                <section className={`mb-16 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <TerminalWindow title="neofetch" className="max-w-2xl">
                        <div className="space-y-2 text-sm">
                            <p><span className="text-green-600">user@portfolio</span>:<span className="text-blue-400">~</span>$ neofetch</p>
                            {statsData.map((stat, index) => (
                                <p key={index} className="text-green-400/80">
                                    {index === statsData.length - 1 ? '└──' : '├──'} {stat.label}: <span className="text-white">{stat.value}</span>
                                </p>
                            ))}
                        </div>
                    </TerminalWindow>
                </section>

                {/* Section Contact */}
                <section className={`mb-16 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <SectionTitle command="./contact.sh" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Formulaire */}
                        <TerminalWindow title="send_message.sh">
                            <form ref={formRef} onSubmit={handleContactSubmit}>
                                {formFields.map((field, index) => (
                                    <FormInput key={index} {...field} />
                                ))}
                                <div className="mt-6">
                                    <AnimatedButton
                                        type="submit"
                                        text={buttonConfig[buttonState].text}
                                        disabled={buttonConfig[buttonState].disabled}
                                        showIcon={false}
                                    />
                                </div>
                            </form>
                        </TerminalWindow>

                        {/* Infos contact */}
                        <div className="space-y-6">
                            <GlowingCard className="p-6">
                                <h3 className="text-xl text-green-400 mb-4 flex items-center gap-2">
                                    <span className="text-green-600">{`>`}</span> Coordonnées
                                </h3>
                                <div className="space-y-4 text-green-400/80">
                                    <p>📧 {contactInfo.email}</p>
                                    <p>📍 {contactInfo.location}</p>
                                    <p>📞 {contactInfo.phone}</p>
                                </div>
                            </GlowingCard>

                            <GlowingCard className="p-6">
                                <h3 className="text-xl text-green-400 mb-4 flex items-center gap-2">
                                    <span className="text-green-600">{`>`}</span> Réseaux
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a key={index} href={social.url} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center gap-2 bg-green-900/30 border border-green-500/30
                                                      px-4 py-2 rounded-lg hover:border-green-400 hover:bg-green-900/50
                                                      transition-all duration-300 text-green-400">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d={social.icon} />
                                            </svg>
                                            {social.name}
                                        </a>
                                    ))}
                                </div>
                            </GlowingCard>

                            <GlowingCard className="p-6">
                                <h3 className="text-xl text-green-400 mb-4 flex items-center gap-2">
                                    <span className="text-green-600">{`>`}</span> Disponibilité
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                                    <span className="text-green-400/80">Disponible pour de nouveaux projets</span>
                                </div>
                                <p className="text-green-500/60 text-sm mt-3">Temps de réponse moyen : 24-48h</p>
                            </GlowingCard>
                        </div>
                    </div>
                </section>

                {/* Section Navigation en bas */}
                <section className={`mb-8 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Boutons de navigation alignés horizontalement */}
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <button
                            onClick={() => handleNavigation('back', 'back')}
                            disabled={isNavigating}
                            className="flex items-center gap-2 px-6 py-3 bg-green-900/30 border border-green-500/50
                                       rounded-lg text-green-400 font-mono hover:bg-green-900/50 hover:border-green-400
                                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour
                        </button>

                        <button
                            onClick={() => handleNavigation('home', '/')}
                            disabled={isNavigating}
                            className="flex items-center gap-2 px-6 py-3 bg-green-900/30 border border-green-500/50
                                       rounded-lg text-green-400 font-mono hover:bg-green-900/50 hover:border-green-400
                                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </button>

                        <button
                            onClick={() => handleNavigation('design', '/design')}
                            disabled={isNavigating}
                            className="flex items-center gap-2 px-6 py-3 bg-green-900/30 border border-green-500/50
                                       rounded-lg text-green-400 font-mono hover:bg-green-900/50 hover:border-green-400
                                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Design Part
                        </button>
                    </div>

                    {/* Terminal de navigation */}
                    {isNavigating && (
                        <div className="max-w-2xl mx-auto">
                            <TerminalWindow title="navigation.sh">
                                <div className="space-y-2 text-sm">
                                    {navigationCommands[navigationData.type]?.slice(0, currentLineIndex).map((line, index) => (
                                        <p key={index} className={`${line.startsWith('$') ? 'text-green-400' : 'text-green-500/70'}`}>
                                            {line}
                                        </p>
                                    ))}
                                    <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
                                </div>
                            </TerminalWindow>
                        </div>
                    )}
                </section>

                {/* Effet scanline */}
                <div className="fixed inset-0 pointer-events-none z-20 opacity-[0.02]"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)' }}
                />
            </div>
        </div>
    );
}