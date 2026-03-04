import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from "@emailjs/browser";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Données des logiciels maîtrisés
const skillsData = {
    design: [
        { skill: "Figma", level: 85 },
        { skill: "Adobe Express", level: 69 },
        { skill: "Canva", level: 95 },
        { skill: "Adobe XD", level: 75 },
        { skill: "Sketch", level: 70 }
    ],
    prototyping: [
        { skill: "Framer", level: 10 },
        { skill: "Visily", level: 80 },
        //{ skill: "InVision", level: 60 },
        //{ skill: "Principle", level: 55 }
    ],
    other: [
        //{ skill: "After Effects", level: 50 },
        { skill: "Blender", level: 1 }
    ]
};

// Catégories de projets (remplacées par types : maquette / affiche)
const projectCategories = [
    { id: "all", label: "Tous" },
    { id: "maquette", label: "Maquettes" },
    { id: "affiche", label: "Affiches" }
];

// Projets design réalisés
const projectsData = [
    {
        id: 1,
        name: "App Mobile E-commerce",
        description: "Interface moderne pour une application de shopping avec une expérience utilisateur fluide et intuitive.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
        date: "2024-06",
        dateDisplay: "06/2024",
        client: "Startup Fashion",
        link: "https://example.com",
        category: "mobile",
        type: "maquette"
    },
    {
        id: 2,
        name: "Site Web Portfolio",
        description: "Design élégant et minimaliste pour un portfolio d'artiste avec animations subtiles.",
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500",
        date: "2024-03",
        dateDisplay: "03/2024",
        client: "Artiste Indépendant",
        link: "https://example.com",
        category: "web",
        type: "maquette"
    },
    {
        id: 3,
        name: "Identité Visuelle",
        description: "Création d'une identité de marque complète : logo, charte graphique, supports de communication.",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
        date: "2023-11",
        dateDisplay: "11/2023",
        client: "Entreprise Tech",
        link: "https://example.com",
        category: "branding",
        type: "affiche"
    }
];

// Réseaux sociaux
const socialLinks = [
    { name: "GitHub", url: "https://github.com", icon: FaGithub },
    { name: "LinkedIn", url: "https://linkedin.com", icon: FaLinkedin },
    { name: "Instagram", url: "https://instagram.com", icon: FaInstagram },
    { name: "WhatsApp", url: "https://wa.me/22891020171", icon: FaWhatsapp },
    { name: "Twitter/X", url: "https://twitter.com", icon: FaXTwitter }
];

// Commandes de navigation (déplacées au top-level pour être stables dans les hooks)
const navigationCommands = {
    back: ["Retour en arrière...", "Chargement..."],
    home: ["Retour à l'accueil...", "Navigation..."],
    dev: ["Vers la section Dev...", "Chargement du portfolio développement..."]
};

// Composant SkillCard artistique
function SkillCard({ skill, level }) {
    return (
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800 font-abril">{skill}</h3>
                <span className="text-pink-500 font-bold text-xl">{level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${level}%` }}
                />
            </div>
        </div>
    );
}

// Composant ProjectCard artistique (modifié pour supporter les deux types)
function ProjectCard({ project, navigate }) {
    return (
        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                        {project.dateDisplay}
                    </span>
                    <span className="text-gray-500 text-sm font-poppins">{project.client}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-abril">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4 font-poppins line-clamp-3">{project.description}</p>

                {/* Boutons selon le type */}
                {project.type === 'maquette' ? (
                    // Maquettes : bouton externe pour visiter le prototype
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
                    >
                        <span className="font-poppins">Visiter le prototype</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                ) : (
                    // Affiches : navigation interne vers la page de détail
                    <button
                        onClick={() => navigate(`/design/project/${project.id}`)}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
                    >
                        <span className="font-poppins">Voir le projet</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export default function DesignPart() {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isNavigating, setIsNavigating] = useState(false);
    const [navigationData, setNavigationData] = useState({ type: '', destination: '' });
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        title: '',
        message: ''
    });
    const formRef = useRef();
    const [buttonState, setButtonState] = useState('idle');

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
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
                    setFormData({ name: '', email: '', title: '', message: '' });
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
        idle: { text: 'Envoyer le message', className: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600', disabled: false },
        sending: { text: 'Envoi en cours...', className: 'bg-gradient-to-r from-pink-400 to-purple-400 cursor-wait', disabled: true },
        sent: { text: '✓ Message envoyé !', className: 'bg-green-500', disabled: true },
        error: { text: '✗ Échec de l\'envoi', className: 'bg-red-500', disabled: true },
    };

    useEffect(() => {
        if (!isNavigating || !navigationData.type) return;

        const commands = navigationCommands[navigationData.type] || [];

        if (currentLineIndex < commands.length) {
            const timer = setTimeout(() => {
                setCurrentLineIndex(prev => prev + 1);
            }, 400);
            return () => clearTimeout(timer);
        } else if (currentLineIndex >= commands.length) {
            const timer = setTimeout(() => {
                if (navigationData.destination === 'back') {
                    navigate(-1);
                } else {
                    navigate(navigationData.destination);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isNavigating, currentLineIndex, navigationData, navigate, navigationCommands]);

    const handleNavigation = (type, destination) => {
        setNavigationData({ type, destination });
        setCurrentLineIndex(0);
        setIsNavigating(true);
    };

    // Filtrer et trier les projets (par type maintenant)
    const filteredProjects = projectsData
        .filter(project => selectedCategory === "all" || project.type === selectedCategory)
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const renderSkillCategory = (title, skills) => (
        <div className="mb-8">
            <h3 className="text-2xl text-gray-800 mb-4 flex items-center gap-2 font-abril">
                <span className="text-pink-500">✦</span> {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((item, index) => (
                    <SkillCard key={index} skill={item.skill} level={item.level} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
            {/* Motifs décoratifs en arrière-plan */}
            <div className="fixed inset-0 pointer-events-none opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full blur-3xl" />
                <div className="absolute top-40 right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl" />
                <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-blue-300 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/3 w-44 h-44 bg-pink-200 rounded-full blur-3xl" />
            </div>

            {/* Patterns topographiques animés */}
            <div className="fixed inset-0 pointer-events-none opacity-50">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        {/* Pattern topographique 1 */}
                        <pattern id="topo1" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
                            <g className="animate-[spin_60s_linear_infinite] origin-center">
                                <circle cx="200" cy="200" r="50" fill="none" stroke="rgba(219, 39, 119, 0.5)" strokeWidth="5"/>
                                <circle cx="200" cy="200" r="80" fill="none" stroke="rgba(219, 39, 119, 0.45)" strokeWidth="4"/>
                                <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(219, 39, 119, 0.4)" strokeWidth="4"/>
                                <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(219, 39, 119, 0.35)" strokeWidth="3.5"/>
                                <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(219, 39, 119, 0.3)" strokeWidth="3"/>
                            </g>
                        </pattern>

                        {/* Pattern topographique 2 */}
                        <pattern id="topo2" x="0" y="0" width="350" height="350" patternUnits="userSpaceOnUse">
                            <g className="animate-[spin_45s_linear_infinite_reverse] origin-center">
                                <ellipse cx="175" cy="175" rx="40" ry="60" fill="none" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="5"/>
                                <ellipse cx="175" cy="175" rx="70" ry="90" fill="none" stroke="rgba(168, 85, 247, 0.45)" strokeWidth="4"/>
                                <ellipse cx="175" cy="175" rx="100" ry="120" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="4"/>
                                <ellipse cx="175" cy="175" rx="130" ry="150" fill="none" stroke="rgba(168, 85, 247, 0.35)" strokeWidth="3.5"/>
                            </g>
                        </pattern>

                        {/* Pattern topographique 3 - lignes ondulées */}
                        <pattern id="topo3" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
                            <g className="animate-[pulse_8s_ease-in-out_infinite]">
                                <path d="M0,150 Q75,100 150,150 T300,150" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="5"/>
                                <path d="M0,120 Q75,70 150,120 T300,120" fill="none" stroke="rgba(59, 130, 246, 0.45)" strokeWidth="4"/>
                                <path d="M0,180 Q75,130 150,180 T300,180" fill="none" stroke="rgba(59, 130, 246, 0.45)" strokeWidth="4"/>
                                <path d="M0,90 Q75,40 150,90 T300,90" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="3.5"/>
                                <path d="M0,210 Q75,160 150,210 T300,210" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="3.5"/>
                            </g>
                        </pattern>

                        {/* Pattern de courbes organiques */}
                        <pattern id="topo4" x="0" y="0" width="250" height="250" patternUnits="userSpaceOnUse">
                            <g className="animate-[bounce_10s_ease-in-out_infinite]">
                                <path d="M0,125 C50,75 100,175 150,125 S250,75 250,125" fill="none" stroke="rgba(236, 72, 153, 0.5)" strokeWidth="5"/>
                                <path d="M0,100 C50,50 100,150 150,100 S250,50 250,100" fill="none" stroke="rgba(236, 72, 153, 0.45)" strokeWidth="4"/>
                                <path d="M0,150 C50,100 100,200 150,150 S250,100 250,150" fill="none" stroke="rgba(236, 72, 153, 0.45)" strokeWidth="4"/>
                            </g>
                        </pattern>
                    </defs>

                    {/* Application des patterns */}
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#topo1)" opacity="0.8"/>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#topo2)" opacity="0.7"/>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#topo3)" opacity="0.6"/>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#topo4)" opacity="0.7"/>
                </svg>
            </div>

            <div className="relative z-10 p-8 md:p-16">
                {/* Bouton Retour */}
                <button
                    onClick={() => handleNavigation('back', 'back')}
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors duration-300 mb-6 group font-poppins"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-semibold">Retour</span>
                </button>

                {/* Header */}
                <header className={`mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 font-abril">
                            UI|UX Designer
                        </h1>
                        <p className="text-gray-600 text-xl md:text-2xl font-poppins italic">
                            Créer des expériences visuelles mémorables
                        </p>
                    </div>
                </header>

                {/* Section Whoami */}
                <section className={`mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 font-abril">
                        <span className="text-pink-500">✦</span> À propos de mon travail
                    </h2>
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-pink-100">
                        <p className="text-gray-700 text-lg leading-relaxed font-poppins">
                            En tant que designer UI|UX, je combine esthétique et fonctionnalité pour créer des interfaces
                            qui captivent et engagent. Mon approche met l'utilisateur au centre de chaque décision de design,
                            en alliant recherche, créativité et attention aux détails pour livrer des expériences digitales
                            exceptionnelles.
                        </p>
                    </div>
                </section>

                {/* Section Logiciels maîtrisés */}
                <section className={`mb-16 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 font-abril">
                        <span className="text-pink-500">✦</span> Logiciels maîtrisés
                    </h2>
                    {renderSkillCategory("Design", skillsData.design)}
                    {renderSkillCategory("Prototypage", skillsData.prototyping)}
                    {renderSkillCategory("Autres", skillsData.other)}
                </section>

                {/* Section Projets */}
                <section className={`mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 font-abril">
                        <span className="text-pink-500">✦</span> Mes Réalisations
                    </h2>

                    {/* Filtres */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {projectCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 font-poppins ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                                        : 'bg-white text-gray-700 border-2 border-pink-200 hover:border-pink-400'
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Grille des projets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} navigate={navigate} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg font-poppins">Aucun projet dans cette catégorie</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Section Contact / Footer */}
                <section className={`mb-16 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-pink-200">
                        {/* Titre */}
                        <h2 className="text-4xl font-bold text-center mb-12 font-abril bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Contactez-moi
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                            {/* Formulaire de contact */}
                            <div className="font-poppins">
                                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Envoyez un message</h3>
                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                                    {/* Nom */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                                            Nom complet <span className="text-pink-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                                            Email <span className="text-pink-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    {/* Sujet */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700">
                                            Sujet
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                            placeholder="Projet de collaboration..."
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
                                            Message <span className="text-pink-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="5"
                                            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
                                            placeholder="Décrivez votre projet ou votre demande..."
                                        />
                                    </div>

                                    {/* Bouton Submit */}
                                    <button
                                        type="submit"
                                        disabled={buttonConfig[buttonState].disabled}
                                        className={`w-full px-6 py-3 ${buttonConfig[buttonState].className} text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/30`}
                                    >
                                        {buttonConfig[buttonState].text}
                                    </button>
                                </form>
                            </div>

                            {/* Réseaux sociaux et infos */}
                            <div className="font-poppins">
                                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Suivez-moi</h3>

                                {/* Réseaux sociaux */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-pink-200 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 group"
                                        >
                                            <social.icon className="text-2xl text-pink-500 group-hover:text-pink-600 transition-colors" />
                                            <span className="text-sm text-gray-700">{social.name}</span>
                                        </a>
                                    ))}
                                </div>

                                {/* Informations de contact */}
                                <div className="bg-white rounded-xl p-6 border-2 border-pink-200">
                                    <h4 className="text-lg font-semibold mb-4 text-gray-800">Coordonnées</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-700">jefftchamie@gmail.com</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-gray-700">+228 91020171</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-gray-700">Lomé, Togo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Séparateur */}
                        <div className="border-t-2 border-pink-300 my-8"></div>

                        {/* Copyright */}
                        <div className="text-center text-gray-600 text-sm font-poppins">
                            <p>© {new Date().getFullYear()} - Made by <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-semibold">Jefto2.0</span> ✨</p>
                        </div>
                    </div>
                </section>

                {/* Section Navigation en bas */}
                <section className={`mb-8 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <button
                            onClick={() => handleNavigation('back', 'back')}
                            disabled={isNavigating}
                            className="px-6 py-3 bg-white border-2 border-pink-300 rounded-full text-gray-700 font-semibold hover:bg-pink-50 transition-all duration-300 disabled:opacity-50 font-poppins"
                        >
                            Retour
                        </button>

                        <button
                            onClick={() => handleNavigation('home', '/')}
                            disabled={isNavigating}
                            className="px-6 py-3 bg-white border-2 border-purple-300 rounded-full text-gray-700 font-semibold hover:bg-purple-50 transition-all duration-300 disabled:opacity-50 font-poppins"
                        >
                            Home
                        </button>

                        <button
                            onClick={() => handleNavigation('dev', '/dev')}
                            disabled={isNavigating}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 disabled:opacity-50 font-poppins"
                        >
                            Dev Part
                        </button>
                    </div>

                    {/* Terminal de navigation */}
                    {isNavigating && (
                        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-pink-200">
                            <div className="space-y-2 text-sm font-poppins">
                                {navigationCommands[navigationData.type]?.slice(0, currentLineIndex).map((line, index) => (
                                    <p key={index} className="text-pink-600">
                                        {line}
                                    </p>
                                ))}
                                <span className="inline-block w-2 h-4 bg-pink-500 animate-pulse" />
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}


