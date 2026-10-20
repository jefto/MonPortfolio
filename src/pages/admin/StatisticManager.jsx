import { useState, useEffect } from 'react';
import { FaSave, FaCode, FaPaintBrush, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import {
    getStatistics,
    updateStatistics,
    formatWhatsAppUrl,
    DEFAULT_CONTACT_INFO,
} from '../../services/api';

export default function StatisticManager() {
    const [form, setForm] = useState({
        completedProjects: 0,
        yearsExperience: 0,
        masteredTechnologies: 0,
        mockupsCreated: 0,
        postersDesigned: 0,
        masteredSoftware: 0,
        contactPhone: DEFAULT_CONTACT_INFO.contactPhone,
        contactEmail: DEFAULT_CONTACT_INFO.contactEmail,
        contactLocation: DEFAULT_CONTACT_INFO.contactLocation,
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getStatistics();
            if (data) {
                setForm({
                    completedProjects: data.completedProjects || 0,
                    yearsExperience: data.yearsExperience || 0,
                    masteredTechnologies: data.masteredTechnologies || 0,
                    mockupsCreated: data.mockupsCreated || 0,
                    postersDesigned: data.postersDesigned || 0,
                    masteredSoftware: data.masteredSoftware || 0,
                    contactPhone: data.contactPhone || DEFAULT_CONTACT_INFO.contactPhone,
                    contactEmail: data.contactEmail || DEFAULT_CONTACT_INFO.contactEmail,
                    contactLocation: data.contactLocation || DEFAULT_CONTACT_INFO.contactLocation,
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const payload = {
                completedProjects: parseInt(form.completedProjects, 10) || 0,
                yearsExperience: parseInt(form.yearsExperience, 10) || 0,
                masteredTechnologies: parseInt(form.masteredTechnologies, 10) || 0,
                mockupsCreated: parseInt(form.mockupsCreated, 10) || 0,
                postersDesigned: parseInt(form.postersDesigned, 10) || 0,
                masteredSoftware: parseInt(form.masteredSoftware, 10) || 0,
                contactPhone: (form.contactPhone || '').trim() || DEFAULT_CONTACT_INFO.contactPhone,
                contactEmail: (form.contactEmail || '').trim() || DEFAULT_CONTACT_INFO.contactEmail,
                contactLocation: (form.contactLocation || '').trim() || DEFAULT_CONTACT_INFO.contactLocation,
            };
            await updateStatistics(payload);
            setSuccessMsg('Coordonnées de contact et statistiques mises à jour avec succès !');
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">Chargement des coordonnées et statistiques...</p>
            </div>
        );
    }

    const whatsappLink = formatWhatsAppUrl(form.contactPhone);

    return (
        <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Coordonnées de Contact & Statistiques</h2>
            <p className="text-zinc-500 text-sm mb-6">
                Modifiez ici votre numéro de téléphone (redirigé automatiquement vers WhatsApp au clic sur le site), votre adresse email, votre localisation et vos compteurs.
            </p>

            {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
                    {successMsg}
                </div>
            )}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
                {/* Section Coordonnées de Contact & WhatsApp */}
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 bg-emerald-700 text-white">
                        <div className="flex items-center gap-3">
                            <FaWhatsapp className="text-lg" />
                            <h3 className="font-semibold">Coordonnées de Contact & Redirection WhatsApp</h3>
                        </div>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-md transition-colors"
                        >
                            Tester le lien WhatsApp ↗
                        </a>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-1.5">
                                <FaWhatsapp className="text-emerald-600" />
                                Numéro de téléphone (WhatsApp)
                            </label>
                            <input
                                type="text"
                                value={form.contactPhone}
                                onChange={(e) => handleChange('contactPhone', e.target.value)}
                                placeholder="+228 91 02 01 71"
                                className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm"
                            />
                            <p className="text-xs text-zinc-500 mt-1.5 font-mono truncate">
                                Redirection : <span className="text-emerald-700 font-semibold">{whatsappLink}</span>
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-1.5">
                                <FaEnvelope className="text-blue-600" />
                                Adresse Email professionnelle
                            </label>
                            <input
                                type="email"
                                value={form.contactEmail}
                                onChange={(e) => handleChange('contactEmail', e.target.value)}
                                placeholder="jefftchamie@gmail.com"
                                className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                            />
                            <p className="text-xs text-zinc-500 mt-1.5">
                                Affiché sur la page d'accueil, la section Contact et les pieds de page.
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-1.5">
                                <FaMapMarkerAlt className="text-zinc-600" />
                                Localisation
                            </label>
                            <input
                                type="text"
                                value={form.contactLocation}
                                onChange={(e) => handleChange('contactLocation', e.target.value)}
                                placeholder="Lomé, Togo"
                                className="w-full px-3.5 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Section Dev */}
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-3 px-6 py-4 bg-zinc-900 text-white">
                        <FaCode />
                        <h3 className="font-semibold">Statistiques — Page Développement</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Projets complétés</label>
                            <input
                                type="number"
                                min="0"
                                value={form.completedProjects}
                                onChange={(e) => handleChange('completedProjects', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 text-sm"
                            />
                            <p className="text-xs text-zinc-400 mt-1">Affiché : "{form.completedProjects}+"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Années d'expérience</label>
                            <input
                                type="number"
                                min="0"
                                value={form.yearsExperience}
                                onChange={(e) => handleChange('yearsExperience', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 text-sm"
                            />
                            <p className="text-xs text-zinc-400 mt-1">Affiché : "{form.yearsExperience}+"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Technologies maîtrisées</label>
                            <input
                                type="number"
                                min="0"
                                value={form.masteredTechnologies}
                                onChange={(e) => handleChange('masteredTechnologies', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 text-sm"
                            />
                            <p className="text-xs text-zinc-400 mt-1">Affiché : "{form.masteredTechnologies}+"</p>
                        </div>
                    </div>
                </div>

                {/* Section Design */}
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-3 px-6 py-4 bg-blue-600 text-white">
                        <FaPaintBrush />
                        <h3 className="font-semibold">Statistiques — Page Design</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Maquettes créées</label>
                            <input
                                type="number"
                                min="0"
                                value={form.mockupsCreated}
                                onChange={(e) => handleChange('mockupsCreated', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <p className="text-xs text-zinc-400 mt-1">Affiché : "{form.mockupsCreated}+"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Affiches conçues</label>
                            <input
                                type="number"
                                min="0"
                                value={form.postersDesigned}
                                onChange={(e) => handleChange('postersDesigned', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <p className="text-xs text-zinc-400 mt-1">Affiché : "{form.postersDesigned}+"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Logiciels maîtrisés</label>
                            <input
                                type="number"
                                min="0"
                                value={form.masteredSoftware}
                                onChange={(e) => handleChange('masteredSoftware', e.target.value)}
                                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <p className="text-xs text-zinc-400 mt-1">Affiché : "{form.masteredSoftware}+"</p>
                        </div>
                    </div>
                </div>

                {/* Bouton sauvegarder */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm disabled:opacity-50"
                    >
                        <FaSave />
                        {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
}
