import { useState, useEffect, useRef } from 'react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaHandsHelping,
    FaArrowUp,
    FaArrowDown,
    FaImage,
} from 'react-icons/fa';
import {
    getVolunteerings,
    createVolunteering,
    updateVolunteering,
    deleteVolunteering,
    getImageUrl,
} from '../../services/api';

const emptyForm = {
    title: '',
    organization: '',
    period: '',
    location: 'Lomé, Togo',
    description: '',
    imageUrl: '',
    orderIndex: 0,
};

export default function VolunteeringManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [deleting, setDeleting] = useState(null);
    const fileInputRef = useRef(null);

    const fetchAll = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getVolunteerings();
            setItems(data || []);
        } catch (err) {
            setError(err.message || 'Impossible de charger les activités de bénévolat');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const resetForm = () => {
        setForm({
            ...emptyForm,
            orderIndex: items.length,
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setEditingId(null);
        setError('');
    };

    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    const openEdit = (item) => {
        setForm({
            title: item.title || '',
            organization: item.organization || '',
            period: item.period || '',
            location: item.location || 'Lomé, Togo',
            description: item.description || '',
            imageUrl: item.imageUrl || '',
            orderIndex: item.orderIndex ?? 0,
        });
        setSelectedFile(null);
        setPreviewUrl(item.imageUrl ? getImageUrl(item.imageUrl) : '');
        setEditingId(item.id);
        setShowForm(true);
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (selectedFile) {
                const formData = new FormData();
                formData.append('title', form.title.trim());
                formData.append('organization', form.organization.trim());
                formData.append('period', form.period.trim());
                formData.append('location', form.location.trim() || 'Lomé, Togo');
                formData.append('description', form.description.trim());
                formData.append('orderIndex', String(Number(form.orderIndex) || 0));
                formData.append('image', selectedFile);
                if (previewUrl && previewUrl.startsWith('data:')) {
                    formData.append('imageUrl', previewUrl);
                }

                if (editingId) {
                    await updateVolunteering(editingId, formData, true);
                    showSuccess('Activité de bénévolat mise à jour');
                } else {
                    await createVolunteering(formData, true);
                    showSuccess('Nouvelle activité de bénévolat ajoutée');
                }
            } else {
                const payload = {
                    title: form.title.trim(),
                    organization: form.organization.trim(),
                    period: form.period.trim(),
                    location: form.location.trim() || 'Lomé, Togo',
                    description: form.description.trim(),
                    imageUrl: form.imageUrl || '',
                    orderIndex: Number(form.orderIndex) || 0,
                };

                if (editingId) {
                    await updateVolunteering(editingId, payload, false);
                    showSuccess('Activité de bénévolat mise à jour');
                } else {
                    await createVolunteering(payload, false);
                    showSuccess('Nouvelle activité de bénévolat ajoutée');
                }
            }

            setShowForm(false);
            resetForm();
            fetchAll();
        } catch (err) {
            setError(err.message || "Erreur lors de l'enregistrement de l'activité");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setDeleting(id);
            await deleteVolunteering(id);
            showSuccess('Activité supprimée');
            fetchAll();
        } catch (err) {
            setError(err.message || 'Erreur lors de la suppression');
        } finally {
            setDeleting(null);
        }
    };

    const moveOrder = async (index, direction) => {
        const targetIdx = index + direction;
        if (targetIdx < 0 || targetIdx >= items.length) return;
        const current = items[index];
        const swap = items[targetIdx];
        try {
            await Promise.all([
                updateVolunteering(current.id, { orderIndex: targetIdx }),
                updateVolunteering(swap.id, { orderIndex: index }),
            ]);
            fetchAll();
        } catch (err) {
            setError(err.message || "Impossible de réorganiser l'ordre");
        }
    };

    return (
        <div className="font-poppins">
            {successMsg && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                    <span>{successMsg}</span>
                </div>
            )}
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* Barre d'action supérieure */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                        <FaHandsHelping className="text-emerald-600" />
                        Bénévolat &amp; Activités Sociales ({items.length})
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                        Gérez vos engagements associatifs, mentorat, leadership communautaire et actions sociales affichés sur la page Home.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                    <FaPlus /> Ajouter une activité
                </button>
            </div>

            {/* Liste des activités */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((n) => (
                        <div key={n} className="h-36 bg-white border border-zinc-200 rounded-xl animate-pulse p-5" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-14 bg-white border border-zinc-200 rounded-xl p-8">
                    <FaHandsHelping className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                    <p className="text-zinc-800 font-semibold mb-1">Aucune activité de bénévolat enregistrée</p>
                    <p className="text-zinc-500 text-xs max-w-md mx-auto mb-5">
                        Ajoutez vos actions sociales, associatives ou communautaires pour enrichir la section Bénévolat de la page d&apos;accueil.
                    </p>
                    <button
                        onClick={openCreate}
                        className="px-4 py-2 bg-zinc-900 text-white font-semibold rounded-lg text-xs hover:bg-emerald-600 transition-colors"
                    >
                        Ajouter ma première activité
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className="bg-white border border-zinc-200 hover:border-zinc-400 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                        >
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                {item.imageUrl && (
                                    <img
                                        src={getImageUrl(item.imageUrl)}
                                        alt={item.title}
                                        className="w-16 h-16 rounded-lg object-cover border border-zinc-200 flex-shrink-0"
                                    />
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                            {item.period}
                                        </span>
                                        {item.location && (
                                            <span className="font-mono text-xs text-zinc-500">
                                                · {item.location}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-bold text-zinc-900 truncate">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-blue-600 font-medium mt-0.5">
                                        {item.organization}
                                    </p>
                                    {item.description && (
                                        <p className="text-xs text-zinc-600 mt-2 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                                <div className="flex flex-col gap-1 mr-1">
                                    <button
                                        type="button"
                                        onClick={() => moveOrder(idx, -1)}
                                        disabled={idx === 0}
                                        className="p-1.5 rounded bg-zinc-100 text-zinc-600 hover:text-zinc-900 disabled:opacity-30"
                                        title="Monter"
                                    >
                                        <FaArrowUp className="w-3 h-3" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveOrder(idx, 1)}
                                        disabled={idx === items.length - 1}
                                        className="p-1.5 rounded bg-zinc-100 text-zinc-600 hover:text-zinc-900 disabled:opacity-30"
                                        title="Descendre"
                                    >
                                        <FaArrowDown className="w-3 h-3" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => openEdit(item)}
                                    className="px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs flex items-center gap-1.5 transition-colors"
                                >
                                    <FaEdit /> Modifier
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deleting === item.id}
                                    className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs flex items-center gap-1.5 transition-colors"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal d'ajout / modification */}
            {showForm && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-zinc-900">
                                    {editingId ? "Modifier l'activité de bénévolat" : 'Nouvelle activité de bénévolat'}
                                </h3>
                                <p className="text-xs text-zinc-500">
                                    Engagement social, associatif, mentorat ou vie communautaire
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="p-2 text-zinc-400 hover:text-zinc-800 rounded-lg bg-zinc-100"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                    Rôle ou Intitulé de l&apos;activité *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Ex: Mentor Technique, Bénévole Action Sociale..."
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                    Association / Organisation / Communauté *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.organization}
                                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                                    placeholder="Ex: Association Jeunesse, Communauté Tech Lomé..."
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                        Période / Date *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.period}
                                        onChange={(e) => setForm({ ...form, period: e.target.value })}
                                        placeholder="Ex: 2023 — Présent"
                                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                        Lieu
                                    </label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        placeholder="Ex: Lomé, Togo"
                                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                    Description de l&apos;impact &amp; des actions
                                </label>
                                <textarea
                                    rows="3"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Décrivez votre contribution humaine, sociale ou communautaire..."
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-zinc-900 resize-none"
                                />
                            </div>

                            {/* Photo optionnelle */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-600 mb-1">
                                    Photo / Illustration (Optionnel)
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-xs font-medium text-zinc-800 flex items-center gap-2"
                                    >
                                        <FaImage /> Choisir une image
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    {previewUrl && (
                                        <div className="relative">
                                            <img
                                                src={previewUrl}
                                                alt="Aperçu"
                                                className="w-12 h-12 rounded-lg object-cover border border-zinc-300"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-lg bg-zinc-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors disabled:opacity-50"
                                >
                                    {submitting
                                        ? 'Enregistrement...'
                                        : editingId
                                        ? 'Enregistrer'
                                        : "Ajouter l'activité"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
