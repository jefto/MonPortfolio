import { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Réseaux sociaux
const socialLinks = [
    { name: "GitHub", url: "https://github.com/jefto", icon: FaGithub },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/jefto2/", icon: FaLinkedin },
    { name: "Instagram", url: "https://www.instagram.com/jefto2.0/", icon: FaInstagram },
    { name: "WhatsApp", url: "https://wa.me/22891020171", icon: FaWhatsapp },
    { name: "Twitter/X", url: "https://x.com/putamadre2_0", icon: FaXTwitter }
];

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message envoyé ! (À connecter avec un backend)');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <footer className="bg-gray-900 text-white py-4 px-8 md:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Titre */}
                <h2 className="text-4xl font-bold text-center mb-12 font-abril">
                    Contactez<span className="text-blue-500">-moi</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Formulaire de contact */}
                    <div className="font-poppins">
                        <h3 className="text-2xl font-semibold mb-6 text-blue-400">Envoyez un message</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nom */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Nom complet <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            {/* Sujet */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                    Sujet
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="Projet de collaboration..."
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                    placeholder="Décrivez votre projet ou votre demande..."
                                />
                            </div>

                            {/* Bouton Submit */}
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                            >
                                Envoyer le message
                            </button>
                        </form>
                    </div>

                    {/* Réseaux sociaux et infos */}
                    <div className="font-poppins">
                        <h3 className="text-2xl font-semibold mb-6 text-blue-400">Suivez-moi</h3>

                        {/* Réseaux sociaux */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition-all duration-300 group"
                                >
                                    <social.icon className="text-2xl text-blue-400 group-hover:text-blue-300 transition-colors" />
                                    <span className="text-sm">{social.name}</span>
                                </a>
                            ))}
                        </div>

                        {/* Informations de contact */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h4 className="text-lg font-semibold mb-4 text-blue-400">Coordonnées</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-300">jefftchamie@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-gray-300">+228 91020171</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-gray-300">Lomé, Togo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Séparateur */}
                <div className="border-t border-gray-800 my-8"></div>

                {/* Copyright */}
                <div className="text-center text-gray-400 text-sm font-poppins">
                    <p>© {new Date().getFullYear()} - Made by <span className="text-blue-400 font-semibold">Jefto2.0</span> </p>
                </div>
            </div>
        </footer>
    );
}