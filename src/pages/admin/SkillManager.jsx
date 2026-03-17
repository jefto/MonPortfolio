import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/api';

const CATEGORY_OPTIONS = [
    { value: 'dev', label: 'Développement' },
    { value: 'design', label: 'Design' },
];

const TYPE_OPTIONS = {
    dev: [
        { value: 'langage-de-programmation', label: 'Langage de programmation' },
        { value: 'framework', label: 'Framework' },
        { value: 'base-de-donnee', label: 'Base de données' },
        { value: 'outil', label: 'Outil' },
    ],
    design: [
        { value: 'design', label: 'Design' },
        { value: 'prototypage', label: 'Prototypage' },
        { value: '3d', label: '3D' },
    ],
};

const TYPE_LABELS = {};
Object.values(TYPE_OPTIONS).flat().forEach(t => { TYPE_LABELS[t.value] = t.label; });

const emptyForm = {
    name: '',
    level: 50,
    category: 'dev',
    type: 'langage-de-programmation',
};

export default function SkillManager() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [deleting, setDeleting] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const data = await getSkills();
            setSkills(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSkills(); }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError('');
    };

    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    const openEdit = (skill) => {
        setForm({
            name: skill.name,
            level: skill.level,
            category: skill.category,
            type: skill.type,
        });
        setEditingId(skill.id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const payload = {
                name: form.name,
                level: parseInt(form.level, 10),
                category: form.category,
                type: form.type,
            };

            if (editingId) {
                await updateSkill(editingId, payload);
                showSuccess('Compétence modifiée !');
            } else {
                await createSkill(payload);
                showSuccess('Compétence ajoutée !');
            }

            setShowForm(false);
            resetForm();
            fetchSkills();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette compétence ?')) return;
        setDeleting(id);
        try {
            await deleteSkill(id);
            showSuccess('Compétence supprimée');
            fetchSkills();
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

    const currentTypeOptions = TYPE_OPTIONS[form.category] || [];

    const filteredSkills = filterCategory === 'all'
        ? skills
        : skills.filter(s => s.category === filterCategory);

    // Grouper par type pour affichage
    const groupedSkills = {};
    filteredSkills.forEach(s => {
        const label = TYPE_LABELS[s.type] || s.type;
        if (!groupedSkills[label]) groupedSkills[label] = [];
        groupedSkills[label].push(s);
    });

    return (
        <div>
            {/* Barre d'outils */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">Compétences</h2>
                    <span className="bg-purple-100 text-purple-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {skills.length}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="all">Toutes</option>
                        {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                        <FaPlus className="text-xs" /> Nouvelle compétence
                    </button>
                </div>
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
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Modifier la compétence' : 'Nouvelle compétence'}
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

                            {/* Nom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                                <input type="text" required value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                    placeholder="React, Figma, PostgreSQL..." />
                            </div>

                            {/* Niveau */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Niveau : <span className="text-purple-600 font-bold">{form.level}%</span>
                                </label>
                                <input type="range" min="0" max="100" value={form.level}
                                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>0%</span><span>50%</span><span>100%</span>
                                </div>
                            </div>

                            {/* Catégorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                                <select required value={form.category}
                                    onChange={(e) => {
                                        const cat = e.target.value;
                                        const firstType = TYPE_OPTIONS[cat]?.[0]?.value || '';
                                        setForm({ ...form, category: cat, type: firstType });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm">
                                    {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                <select required value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm">
                                    {currentTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>

                            {/* Boutons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
                                    Annuler
                                </button>
                                <button type="submit" disabled={submitting}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50">
                                    {submitting ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Liste des compétences */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Chargement...</p>
                </div>
            ) : Object.keys(groupedSkills).length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">Aucune compétence enregistrée</p>
                    <button onClick={openCreate}
                        className="mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium">
                        + Ajouter une compétence
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedSkills).map(([typeName, items]) => (
                        <div key={typeName} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-700 text-sm">{typeName}</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {items.map((skill) => (
                                    <div key={skill.id}
                                        className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                                        {/* Nom */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 text-sm">{skill.name}</p>
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                                                skill.category === 'dev'
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-pink-50 text-pink-600'
                                            }`}>
                                                {skill.category === 'dev' ? 'Dev' : 'Design'}
                                            </span>
                                        </div>

                                        {/* Barre de niveau */}
                                        <div className="w-32 flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        skill.level >= 80 ? 'bg-green-500' :
                                                        skill.level >= 50 ? 'bg-blue-500' :
                                                        skill.level >= 25 ? 'bg-yellow-500' : 'bg-red-400'
                                                    }`}
                                                    style={{ width: `${skill.level}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 w-8 text-right">{skill.level}%</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => openEdit(skill)}
                                                className="p-1.5 text-gray-400 hover:text-purple-500 transition-colors">
                                                <FaEdit className="text-xs" />
                                            </button>
                                            <button onClick={() => handleDelete(skill.id)}
                                                disabled={deleting === skill.id}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

