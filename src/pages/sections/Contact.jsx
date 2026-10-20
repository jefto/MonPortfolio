import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import SEO from "../../components/SEO";
import {
    getStatistics,
    formatWhatsAppUrl,
    DEFAULT_CONTACT_INFO,
} from "../../services/api";

export default function Contact() {
    const formRef = useRef();
    const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);

    useEffect(() => {
        getStatistics()
            .then((stats) => {
                if (stats) {
                    setContactInfo({
                        contactPhone: stats.contactPhone || DEFAULT_CONTACT_INFO.contactPhone,
                        contactEmail: stats.contactEmail || DEFAULT_CONTACT_INFO.contactEmail,
                        contactLocation: stats.contactLocation || DEFAULT_CONTACT_INFO.contactLocation,
                    });
                }
            })
            .catch(() => {});
    }, []);

    const socialLinks = [
        { name: "GitHub", url: "https://github.com/jefto", icon: FaGithub },
        { name: "LinkedIn", url: "https://www.linkedin.com/in/jefto2/", icon: FaLinkedin },
        { name: "Instagram", url: "https://www.instagram.com/jefto2.0/", icon: FaInstagram },
        { name: "WhatsApp", url: formatWhatsAppUrl(contactInfo.contactPhone), icon: FaWhatsapp },
        { name: "Twitter / X", url: "https://x.com/putamadre2_0", icon: FaXTwitter }
    ];
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        title: '',
        message: ''
    });
    const [buttonState, setButtonState] = useState('idle');

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
                () => {
                    setButtonState('error');
                    setTimeout(() => setButtonState('idle'), 3000);
                }
            );
    };

    const buttonConfig = {
        idle: { text: 'Envoyer le message', className: 'bg-blue-600 hover:bg-blue-500', disabled: false },
        sending: { text: 'Transmission en cours...', className: 'bg-zinc-700 cursor-wait', disabled: true },
        sent: { text: 'Message transmis', className: 'bg-emerald-600', disabled: true },
        error: { text: 'Échec de transmission — Réessayer', className: 'bg-red-600', disabled: true },
    };

    return (
        <footer className="relative bg-zinc-950 text-zinc-100 py-16 px-4 sm:px-8 md:px-16 overflow-hidden">
            <SEO
                title="Contact — TCHAMIE Jephte"
                description="Contactez TCHAMIE Jephte, ingénieur logiciel et UI/UX designer à Lomé, Togo. Email : jefftchamie@gmail.com | Tél : +228 91020171."
                path="/contact"
            />
            {/* Figures géométriques en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <svg
                    className="absolute -right-20 -bottom-20 w-[480px] h-[480px] text-white/15"
                    viewBox="0 0 400 400"
                    fill="none"
                >
                    <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                    <circle cx="200" cy="200" r="120" stroke="#3b82f6" strokeOpacity="0.45" strokeWidth="1.5" />
                    <polygon points="200,30 370,200 200,370 30,200" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <svg
                    className="absolute -left-16 top-10 w-[300px] h-[300px] text-amber-400/15"
                    viewBox="0 0 300 300"
                    fill="none"
                >
                    <circle cx="150" cy="150" r="120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
                    <rect x="75" y="75" width="150" height="150" stroke="currentColor" strokeWidth="1.4" transform="rotate(20 150 150)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12 pb-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-400 block mb-2">
                            05 // CONTACT DIRECT &amp; COLLABORATIONS
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold font-abril text-white">
                            Démarrer un projet
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs">
                        <Link to="/dev" className="text-emerald-400 hover:underline">
                            /dev (Engineering)
                        </Link>
                        <span className="text-zinc-700">·</span>
                        <Link to="/design" className="text-amber-400 hover:underline">
                            /design (Studio UI/UX)
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
                    {/* Formulaire */}
                    <div className="lg:col-span-7 font-poppins">
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 text-sm"
                                        placeholder="Nom et prénom"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                                        Adresse email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 text-sm"
                                        placeholder="nom@organisation.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="title" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                                    Objet de la demande
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 text-sm"
                                    placeholder="Développement Full-Stack, Conception UI/UX, Opportunité..."
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 text-sm resize-none"
                                    placeholder="Précisez le périmètre technique, les délais ou les besoins design..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={buttonConfig[buttonState].disabled}
                                className={`w-full px-6 py-3.5 ${buttonConfig[buttonState].className} text-white font-mono text-xs uppercase tracking-widest rounded-lg transition-colors`}
                            >
                                {buttonConfig[buttonState].text}
                            </button>
                        </form>
                    </div>

                    {/* Coordonnées & Réseaux */}
                    <div className="lg:col-span-5 font-poppins space-y-6">
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-4">
                                COORDONNÉES DIRECTES
                            </h3>
                            <div className="space-y-3 text-sm font-mono">
                                <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                                    <span className="text-zinc-500">EMAIL</span>
                                    <a href={`mailto:${contactInfo.contactEmail}`} className="text-zinc-200 hover:text-blue-400">
                                        {contactInfo.contactEmail}
                                    </a>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                                    <span className="text-zinc-500">TÉLÉPHONE (WHATSAPP)</span>
                                    <a
                                        href={formatWhatsAppUrl(contactInfo.contactPhone)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Ouvrir la discussion sur WhatsApp"
                                        className="inline-flex items-center gap-1.5 text-zinc-200 hover:text-emerald-400 transition-colors"
                                    >
                                        <FaWhatsapp className="text-emerald-400 text-sm" />
                                        <span>{contactInfo.contactPhone}</span>
                                    </a>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-zinc-500">LOCALISATION</span>
                                    <span className="text-zinc-200">{contactInfo.contactLocation}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-3">
                                PROFILS &amp; RÉSEAUX
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors group"
                                    >
                                        <social.icon className="text-lg text-zinc-400 group-hover:text-white transition-colors" />
                                        <span className="text-xs font-mono text-zinc-300 group-hover:text-white">
                                            {social.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs font-mono">
                    <p>© {new Date().getFullYear()} TCHAMIE JEPHTE — INGÉNIERIE LOGICIELLE &amp; DESIGN</p>
                    <p>LOMÉ, TOGO</p>
                </div>
            </div>
        </footer>
    );
}