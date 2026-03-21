import { useState, useEffect } from 'react';
import { FaSave, FaCode, FaPaintBrush } from 'react-icons/fa';
import { getStatistics, updateStatistics } from '../../services/api';

export default function StatisticManager() {
    const [form, setForm] = useState({
        completedProjects: 0,
        yearsExperience: 0,
        masteredTechnologies: 0,
        mockupsCreated: 0,
        postersDesigned: 0,
        masteredSoftware: 0,
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
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const payload = {
                completedProjects: parseInt(form.completedProjects, 10),
                yearsExperience: parseInt(form.yearsExperience, 10),
                masteredTechnologies: parseInt(form.masteredTechnologies, 10),
                mockupsCreated: parseInt(form.mockupsCreated, 10),
                postersDesigned: parseInt(form.postersDesigned, 10),
                masteredSoftware: parseInt(form.masteredSoftware, 10),
            };
            await updateStatistics(payload);
            setSuccessMsg('Statistiques mises à jour !');
            setTimeout(() => setSuccessMsg(''), 3000);
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
                <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Chargement des statistiques...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Statistiques du portfolio</h2>
            <p className="text-gray-500 text-sm mb-6">
                Ces chiffres sont affichés en bas des pages Dev et Design du portfolio.
            </p>

            {/* Messages */}
            {successMsg && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{successMsg}</div>
            )}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
                {/* Section Dev */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 bg-gray-800 text-white">
                        <FaCode />
                        <h3 className="font-semibold">Page Développement</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Projets complétés</label>
                            <input type="number" min="0" value={form.completedProjects}
                                onChange={(e) => handleChange('completedProjects', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm" />
                            <p className="text-xs text-gray-400 mt-1">Affiché : "{form.completedProjects}+"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
                            <input type="number" min="0" value={form.yearsExperience}
                                onChange={(e) => handleChange('yearsExperience', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm" />
                            <p className="text-xs text-gray-400 mt-1">Affiché : "{form.yearsExperience}+"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Technologies maîtrisées</label>
                            <input type="number" min="0" value={form.masteredTechnologies}
                                onChange={(e) => handleChange('masteredTechnologies', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm" />
                            <p className="text-xs text-gray-400 mt-1">Affiché : "{form.masteredTechnologies}+"</p>
                        </div>
                    </div>
                </div>

                {/* Section Design */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        <FaPaintBrush />
                        <h3 className="font-semibold">Page Design</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Maquettes créées</label>
                            <input type="number" min="0" value={form.mockupsCreated}
                                onChange={(e) => handleChange('mockupsCreated', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm" />
                            <p className="text-xs text-gray-400 mt-1">Affiché : "{form.mockupsCreated}+"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Affiches conçues</label>
                            <input type="number" min="0" value={form.postersDesigned}
                                onChange={(e) => handleChange('postersDesigned', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm" />
                            <p className="text-xs text-gray-400 mt-1">Affiché : "{form.postersDesigned}+"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logiciels maîtrisés</label>
                            <input type="number" min="0" value={form.masteredSoftware}
                                onChange={(e) => handleChange('masteredSoftware', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm" />
                            <p className="text-xs text-gray-400 mt-1">Affiché : "{form.masteredSoftware}+"</p>
                        </div>
                    </div>
                </div>

                {/* Bouton sauvegarder */}
                <div className="flex justify-end">
                    <button type="submit" disabled={submitting}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium shadow-sm disabled:opacity-50">
                        <FaSave />
                        {submitting ? 'Enregistrement...' : 'Enregistrer les statistiques'}
                    </button>
                </div>
            </form>
        </div>
    );
}

