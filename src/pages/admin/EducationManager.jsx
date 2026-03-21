import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaGraduationCap } from 'react-icons/fa';
import { getEducations, createEducation, updateEducation, deleteEducation } from '../../services/api';

const emptyForm = {
    startYear: new Date().getFullYear(),
    endYear: '',
    inProgress: false,
    title: '',
    school: '',
    description: '',
};

export default function EducationManager() {
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [deleting, setDeleting] = useState(null);

    const fetchEducations = async () => {
        try {
            setLoading(true);
            const data = await getEducations();
            setEducations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEducations(); }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError('');
    };

    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    const openEdit = (edu) => {
        setForm({
            startYear: edu.startYear,
            endYear: edu.endYear ?? '',
            inProgress: edu.endYear === null,
            title: edu.title,
            school: edu.school,
            description: edu.description || '',
        });
        setEditingId(edu.id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const payload = {
                startYear: parseInt(form.startYear, 10),
                endYear: form.inProgress ? null : (form.endYear ? parseInt(form.endYear, 10) : null),
                title: form.title,
                school: form.school,
                description: form.description || null,
            };

            if (editingId) {
                await updateEducation(editingId, payload);
                showSuccess('Formation modifiée !');
            } else {
                await createEducation(payload);
                showSuccess('Formation ajoutée !');
            }

            setShowForm(false);
            resetForm();
            fetchEducations();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette formation ?')) return;
        setDeleting(id);
        try {
            await deleteEducation(id);
            showSuccess('Formation supprimée');
            fetchEducations();
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(null);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const formatYears = (edu) => {
        const end = edu.endYear === null ? 'En cours' : edu.endYear;
        return `${edu.startYear} - ${end}`;
    };

    return (
        <div>
            {/* Barre d'outils */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">Parcours académique</h2>
                    <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {educations.length}
                    </span>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    <FaPlus className="text-xs" /> Nouvelle formation
                </button>
            </div>

            {/* Messages */}
            {successMsg && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{successMsg}</div>
            )}
            {error && !showForm && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            {/* Formulaire modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Modifier la formation' : 'Nouvelle formation'}
                            </h3>
                            <button onClick={() => { setShowForm(false); resetForm(); }}
                                className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
                            )}

                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre / Diplôme *</label>
                                <input type="text" required value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    placeholder="Licence Professionnelle Génie Logiciel" />
                            </div>

                            {/* Établissement */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Établissement *</label>
                                <input type="text" required value={form.school}
                                    onChange={(e) => setForm({ ...form, school: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    placeholder="École Polytechnique de Lomé" />
                            </div>

                            {/* Années */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Année de début *</label>
                                    <input type="number" required min="1990" max="2099" value={form.startYear}
                                        onChange={(e) => setForm({ ...form, startYear: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Année de fin</label>
                                    <input type="number" min="1990" max="2099"
                                        value={form.inProgress ? '' : form.endYear}
                                        disabled={form.inProgress}
                                        onChange={(e) => setForm({ ...form, endYear: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-100 disabled:text-gray-400" />
                                </div>
                            </div>

                            {/* Checkbox En cours */}
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="inProgress" checked={form.inProgress}
                                    onChange={(e) => setForm({ ...form, inProgress: e.target.checked, endYear: '' })}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <label htmlFor="inProgress" className="text-sm text-gray-700">En cours</label>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    placeholder="Description de la formation..." />
                            </div>

                            {/* Boutons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
                                    Annuler
                                </button>
                                <button type="submit" disabled={submitting}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
                                    {submitting ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Liste des formations */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Chargement...</p>
                </div>
            ) : educations.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <FaGraduationCap className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune formation enregistrée</p>
                    <button onClick={openCreate}
                        className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        + Ajouter une formation
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {educations.map((edu) => (
                        <div key={edu.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FaGraduationCap className="text-indigo-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-semibold text-gray-800 text-sm">{edu.title}</h3>
                                            {edu.endYear === null && (
                                                <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium">
                                                    En cours
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-indigo-600 text-sm font-medium">{edu.school}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatYears(edu)}</p>
                                        {edu.description && (
                                            <p className="text-gray-600 text-sm mt-2">{edu.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button onClick={() => openEdit(edu)}
                                        className="p-2 text-gray-400 hover:text-indigo-500 transition-colors">
                                        <FaEdit className="text-sm" />
                                    </button>
                                    <button onClick={() => handleDelete(edu.id)}
                                        disabled={deleting === edu.id}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                                        <FaTrash className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

