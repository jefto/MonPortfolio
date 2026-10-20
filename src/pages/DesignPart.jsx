import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import emailjs from "@emailjs/browser";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
    getProjects,
    mapToDesignProject,
    getSkills,
    groupDesignSkills,
    getStatistics,
    formatWhatsAppUrl,
    DEFAULT_CONTACT_INFO,
} from '../services/api';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';

const projectCategories = [
    { id: "all", label: "Tous les travaux" },
    { id: "maquette", label: "Systèmes UI/UX & Maquettes" },
    { id: "affiche", label: "Direction Artistique & Affiches" }
];

const socialLinks = [
    { name: "GitHub", url: "https://github.com/jefto", icon: FaGithub },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/jefto2/", icon: FaLinkedin },
    { name: "Instagram", url: "https://www.instagram.com/jefto2.0/", icon: FaInstagram },
    { name: "WhatsApp", url: "https://wa.me/22891020171", icon: FaWhatsapp },
    { name: "Twitter/X", url: "https://x.com/putamadre2_0", icon: FaXTwitter }
];

function SkillCard({ skill }) {
    return (
        <div className="group bg-white rounded-xl px-5 py-4 border border-zinc-200 hover:border-amber-500/60 transition-colors flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 font-poppins">{skill}</h3>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
    );
}

function ProjectCard({ project, navigate, index }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: index * 0.05 }}
            className="group bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-zinc-900 transition-all duration-300 flex flex-col justify-between"
        >
            <div>
                <div className="relative h-64 overflow-hidden bg-zinc-100 border-b border-zinc-200">
                    <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-zinc-950/85 backdrop-blur-sm text-white font-code text-[10px] uppercase tracking-widest rounded">
                            {project.type === 'maquette' ? 'UI/UX System' : 'Brand & Print'}
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2 font-code text-[11px] text-zinc-500 uppercase tracking-wider">
                        <span>{project.client || "Studio Project"}</span>
                        <span>{project.dateDisplay}</span>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-950 mb-2 font-abril tracking-tight">
                        {project.name}
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed font-poppins line-clamp-3">
                        {project.description}
                    </p>
                </div>
            </div>

            <div className="px-6 pb-6 pt-2">
                {project.type === 'maquette' && project.link ? (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-zinc-950 hover:bg-amber-600 text-white text-xs font-code uppercase tracking-wider rounded-lg transition-colors"
                    >
                        <span>Inspecter le prototype Figma</span>
                        <span>↗</span>
                    </a>
                ) : (
                    <button
                        onClick={() => navigate(`/design/project/${project.id}`)}
                        className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-zinc-100 hover:bg-zinc-950 text-zinc-900 hover:text-white text-xs font-code uppercase tracking-wider rounded-lg transition-colors"
                    >
                        <span>Étude visuelle & Galerie</span>
                        <span>→</span>
                    </button>
                )}
            </div>
        </motion.article>
    );
}

export default function DesignPart() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        title: '',
        message: ''
    });
    const formRef = useRef();
    const [buttonState, setButtonState] = useState('idle');

    const [projectsData, setProjectsData] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState(null);

    const [skillsData, setSkillsData] = useState({ design: [], prototyping: [], other: [] });
    const [skillsLoading, setSkillsLoading] = useState(true);

    const [designStats, setDesignStats] = useState([
        { label: "Maquettes UI/UX conçues", value: "..." },
        { label: "Campagnes & Affiches", value: "..." },
        { label: "Outils de création maîtrisés", value: "..." },
        { label: "Systèmes visuels livrés", value: "100%" }
    ]);
    const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjectsLoading(true);
                setProjectsError(null);
                const projects = await getProjects({ category: "projet-design" });
                setProjectsData(projects.map(mapToDesignProject));
            } catch (err) {
                console.error("Erreur chargement projets design:", err);
                setProjectsError(err.message);
            } finally {
                setProjectsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setSkillsLoading(true);
                const skills = await getSkills({ category: "design" });
                setSkillsData(groupDesignSkills(skills));
            } catch (err) {
                console.error("Erreur chargement compétences design:", err);
            } finally {
                setSkillsLoading(false);
            }
        };
        fetchSkills();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStatistics();
                if (data) {
                    setDesignStats([
                        { label: "Maquettes UI/UX conçues", value: `${data.mockupsCreated}+` },
                        { label: "Campagnes & Affiches", value: `${data.postersDesigned}+` },
                        { label: "Outils de création maîtrisés", value: `${data.masteredSoftware}+` },
                        { label: "Cohérence Design-to-Code", value: "100%" }
                    ]);
                    setContactInfo({
                        contactPhone: data.contactPhone || DEFAULT_CONTACT_INFO.contactPhone,
                        contactEmail: data.contactEmail || DEFAULT_CONTACT_INFO.contactEmail,
                        contactLocation: data.contactLocation || DEFAULT_CONTACT_INFO.contactLocation,
                    });
                }
            } catch (err) {
                console.error("Erreur chargement statistiques design:", err);
            }
        };
        fetchStats();
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
                () => {
                    setButtonState('sent');
                    setFormData({ name: '', email: '', title: '', message: '' });
                    setTimeout(() => setButtonState('idle'), 3000);
                },
                (error) => {
                    console.error("Erreur lors de l'envoi de l'email :", error.text);
                    setButtonState('error');
                    setTimeout(() => setButtonState('idle'), 3000);
                }
            );
    };

    const buttonConfig = {
        idle: { text: 'Transmettre le brief', className: 'bg-zinc-950 hover:bg-amber-600 text-white', disabled: false },
        sending: { text: 'Transmission en cours...', className: 'bg-zinc-700 text-zinc-200 cursor-wait', disabled: true },
        sent: { text: 'Message transmis avec succès', className: 'bg-emerald-600 text-white', disabled: true },
        error: { text: "Échec de l'envoi — Réessayer", className: 'bg-red-600 text-white', disabled: true },
    };

    const filteredProjects = projectsData
        .filter(project => selectedCategory === "all" || project.type === selectedCategory)
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const renderSkillCategory = (title, skills) => (
        <div className="mb-8">
            <h3 className="text-xs font-code uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((item, index) => (
                    <SkillCard key={index} skill={item.skill} level={item.level} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 relative">
            <SEO
                title="Design Studio & Systèmes UI/UX — TCHAMIE Jephte"
                description="Direction artistique, systèmes de design Figma, prototypage haute-fidélité et identités visuelles par TCHAMIE Jephte."
                path="/design"
            />
            <Navbar variant="light" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                {/* Editorial Hero Header */}
                <header className="border-b border-zinc-200 pb-12 mb-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 font-code text-xs uppercase tracking-widest mb-4">
                                <span>03 // STUDIO DE CRÉATION & SYSTÈMES UI/UX</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-abril text-zinc-950 tracking-tight leading-none">
                                Design Systems &<br />Direction Artistique.
                            </h1>
                        </div>
                        <p className="text-zinc-600 font-poppins text-base sm:text-lg max-w-xl leading-relaxed">
                            Conception d&apos;interfaces structurées, prototypage interactif sur Figma et identités visuelles institutionnelles pensées pour l&apos;implémentation technique directe.
                        </p>
                    </div>

                    {/* Studio Metrics Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        {designStats.map((stat, idx) => (
                            <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-5">
                                <p className="font-code text-2xl sm:text-3xl font-bold text-zinc-950 mb-1">
                                    {stat.value}
                                </p>
                                <p className="font-poppins text-xs text-zinc-500 uppercase tracking-wider">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Methodology Section */}
                <section className="mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-4">
                            <span className="font-code text-xs uppercase tracking-widest text-amber-700 block mb-2">
                                01 // APPROCHE ÉDITORIALE
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-abril text-zinc-950">
                                Du composant atomique à l&apos;architecture produit
                            </h2>
                        </div>
                        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8">
                            <p className="text-zinc-700 text-base sm:text-lg leading-relaxed font-poppins mb-6">
                                Contrairement aux maquettes isolées des contraintes de production, chaque interface est conçue avec une compréhension directe du DOM, des tokens CSS et des états de composants React. Cela garantit une fidélité visuelle totale entre le prototype Figma et le produit déployé.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-100 font-code text-xs text-zinc-600">
                                <div>
                                    <span className="text-zinc-950 font-semibold block mb-1">01. Recherche & Grille</span>
                                    Hiérarchie typographique, parcours utilisateur et wireframes structurels.
                                </div>
                                <div>
                                    <span className="text-zinc-950 font-semibold block mb-1">02. Design Tokens</span>
                                    Variables de couleurs, espacements normalisés et composants réutilisables.
                                </div>
                                <div>
                                    <span className="text-zinc-950 font-semibold block mb-1">03. Handoff & Code</span>
                                    Prototypes haute-fidélité prêts pour l&apos;intégration front-end.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Galerie des Réalisations */}
                <section className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <span className="font-code text-xs uppercase tracking-widest text-amber-700 block mb-2">
                                02 // CATALOGUE VISUEL
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-abril text-zinc-950">
                                Travaux sélectionnés
                            </h2>
                        </div>

                        {/* Filtres */}
                        <div className="flex flex-wrap gap-2">
                            {projectCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-code uppercase tracking-wider transition-colors ${
                                        selectedCategory === category.id
                                            ? 'bg-zinc-950 text-white'
                                            : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-900'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsLoading ? (
                            <div className="col-span-full text-center py-16 bg-white border border-zinc-200 rounded-2xl">
                                <div className="animate-spin w-8 h-8 border-2 border-zinc-950 border-t-transparent rounded-full mx-auto mb-3" />
                                <p className="text-zinc-500 font-code text-xs uppercase tracking-widest">Chargement du catalogue...</p>
                            </div>
                        ) : projectsError ? (
                            <div className="col-span-full text-center py-12 bg-white border border-red-200 rounded-2xl p-6">
                                <p className="text-red-600 font-poppins mb-2">Erreur : {projectsError}</p>
                                <p className="text-zinc-500 text-xs font-code">
                                    API : {process.env.REACT_APP_API_URL || 'http://localhost:3000'}
                                </p>
                            </div>
                        ) : filteredProjects.length > 0 ? (
                            filteredProjects.map((project, index) => (
                                <ProjectCard key={project.id} project={project} navigate={navigate} index={index} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 bg-white border border-zinc-200 rounded-2xl">
                                <p className="text-zinc-500 font-poppins">Aucun projet dans cette catégorie.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Outils & Compétences */}
                <section className="mb-20">
                    <div className="mb-8">
                        <span className="font-code text-xs uppercase tracking-widest text-amber-700 block mb-2">
                            03 // STACK CRÉATIVE
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-abril text-zinc-950">
                            Logiciels & Outils de Conception
                        </h2>
                    </div>

                    {skillsLoading ? (
                        <div className="text-center py-12 bg-white border border-zinc-200 rounded-2xl">
                            <div className="animate-spin w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto mb-2" />
                            <p className="text-zinc-500 font-code text-xs">Chargement des outils...</p>
                        </div>
                    ) : (
                        <>
                            {skillsData.design.length > 0 && renderSkillCategory("Design Graphique & Direction Artistique", skillsData.design)}
                            {skillsData.prototyping.length > 0 && renderSkillCategory("UI/UX & Prototypage Interactif", skillsData.prototyping)}
                            {skillsData.other.length > 0 && renderSkillCategory("Outils Complémentaires", skillsData.other)}
                            {skillsData.design.length === 0 && skillsData.prototyping.length === 0 &&
                             skillsData.other.length === 0 && (
                                <p className="text-zinc-500 text-center py-8 bg-white border border-zinc-200 rounded-xl font-poppins">
                                    Aucune compétence enregistrée.
                                </p>
                            )}
                        </>
                    )}
                </section>

                {/* Contact Studio */}
                <section className="bg-white border border-zinc-200 rounded-2xl p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-5 flex flex-col justify-between">
                            <div>
                                <span className="font-code text-xs uppercase tracking-widest text-amber-700 block mb-2">
                                    04 // COLLABORATION
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-abril text-zinc-950 mb-4">
                                    Démarrer un projet Design ou Hybride
                                </h2>
                                <p className="text-zinc-600 font-poppins text-sm leading-relaxed mb-8">
                                    Disponible pour la conception de systèmes UI/UX, la refonte d&apos;identités visuelles ou le développement front-end complet de vos produits.
                                </p>

                                <div className="space-y-3 font-code text-xs text-zinc-700 mb-8">
                                    <a
                                        href={`mailto:${contactInfo.contactEmail}`}
                                        className="block p-3 rounded-lg bg-[#FAF8F5] border border-zinc-200 hover:border-zinc-900 transition-colors"
                                    >
                                        <span className="text-zinc-400 block mb-0.5">EMAIL DIRECT</span>
                                        {contactInfo.contactEmail}
                                    </a>
                                    <a
                                        href={formatWhatsAppUrl(contactInfo.contactPhone)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Ouvrir la discussion sur WhatsApp"
                                        className="block p-3 rounded-lg bg-[#FAF8F5] border border-zinc-200 hover:border-emerald-600 transition-colors group"
                                    >
                                        <span className="text-zinc-400 block mb-0.5">TÉLÉPHONE / WHATSAPP (CLIQUER POUR DISCUTER)</span>
                                        <span className="inline-flex items-center gap-1.5 group-hover:text-emerald-700 font-semibold">
                                            <FaWhatsapp className="text-emerald-600 text-sm" />
                                            {contactInfo.contactPhone} — {contactInfo.contactLocation}
                                        </span>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <p className="font-code text-[11px] uppercase tracking-widest text-zinc-400 mb-3">
                                    Réseaux & Profils
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-[#FAF8F5] border border-zinc-200 rounded-lg hover:border-zinc-950 text-xs font-poppins text-zinc-800 transition-colors"
                                        >
                                            <social.icon className="text-sm text-zinc-900" />
                                            <span>{social.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 font-poppins">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-xs font-code uppercase tracking-wider mb-2 text-zinc-700">
                                            Nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-[#FAF8F5] border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-950 transition-colors"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-code uppercase tracking-wider mb-2 text-zinc-700">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-[#FAF8F5] border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-950 transition-colors"
                                            placeholder="nom@organisation.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="title" className="block text-xs font-code uppercase tracking-wider mb-2 text-zinc-700">
                                        Objet de la mission
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-950 transition-colors"
                                        placeholder="Design System, Refonte UI/UX, Identité..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs font-code uppercase tracking-wider mb-2 text-zinc-700">
                                        Détails & Objectifs *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-950 transition-colors resize-none"
                                        placeholder="Contexte du produit, délais et livrables attendus..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={buttonConfig[buttonState].disabled}
                                    className={`w-full px-6 py-3.5 ${buttonConfig[buttonState].className} font-code text-xs uppercase tracking-widest rounded-lg transition-colors`}
                                >
                                    {buttonConfig[buttonState].text}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
