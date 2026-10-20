import { useState, useEffect } from 'react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaBriefcase,
    FaArrowUp,
    FaArrowDown,
} from 'react-icons/fa';
import {
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} from '../../services/api';

export const EMPLOYMENT_TYPES = [
    { value: 'FULL_TIME', label: 'Temps plein' },
    { value: 'PART_TIME', label: 'Temps partiel' },
];

export const WORK_MODES = [
    { value: 'ONSITE', label: 'En présentiel' },
    { value: 'REMOTE', label: 'En ligne' },
    { value: 'HYBRID', label: 'Hybride' },
];

export const EMPLOYMENT_LABELS = {
    FULL_TIME: 'Temps plein',
    PART_TIME: 'Temps partiel',
};

export const WORK_MODE_LABELS = {
    ONSITE: 'En présentiel',
    REMOTE: 'En ligne',
    HYBRID: 'Hybride',
};

// Calcule automatiquement le score de la barre d'histogramme à partir des dates
function computeScoreFromDates(startDate = '', endDate = '', isCurrent = false) {
    if (isCurrent) return 92;
    const startYearMatch = String(startDate).match(/(20\d{2}|19\d{2})/);
    const endYearMatch = String(endDate).match(/(20\d{2}|19\d{2})/);
    if (startYearMatch && endYearMatch) {
        const diffYears = Math.max(0.5, Number(endYearMatch[1]) - Number(startYearMatch[1]));
        return Math.min(96, Math.max(45, Math.round(45 + diffYears * 18)));
    }
    return 75;
}

const emptyForm = {
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    employmentType: 'FULL_TIME',
    workMode: 'ONSITE',
    orderIndex: 0,
};

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [deleting, setDeleting] = useState(null);

    const fetchAll = async () => {
        try {
            setLoading(true);
            setError('');
            const expData = await getExperiences();
            setExperiences(expData || []);
        } catch (err) {
            setError(err.message || 'Impossible de charger les postes');
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
            orderIndex: experiences.length,
        });
        setEditingId(null);
        setError('');
    };

    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    const openEdit = (exp) => {
        const metrics = exp.metrics || {};
        setForm({
            title: exp.title || '',
            company: exp.company || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            isCurrent: Boolean(exp.isCurrent),
            employmentType: metrics.employmentType || 'FULL_TIME',
            workMode: metrics.workMode || 'ONSITE',
            orderIndex: exp.orderIndex ?? 0,
        });
        setEditingId(exp.id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const cleanStart = form.startDate.trim();
            const cleanEnd = form.isCurrent ? null : form.endDate.trim() || null;
            const impactScore = computeScoreFromDates(cleanStart, cleanEnd, form.isCurrent);
            const periodLabel = `${cleanStart} — ${form.isCurrent ? 'Présent' : cleanEnd || '—'}`;

            const payload = {
                title: form.title.trim(),
                company: form.company.trim(),
                roleType: 'HYBRID',
                startDate: cleanStart,
                endDate: cleanEnd,
                isCurrent: Boolean(form.isCurrent),
                description: '',
                achievements: [],
                techStack: [],
                metrics: {
                    devWeight: 55,
                    designWeight: 45,
                    impactScore,
                    impactLabel: periodLabel,
                    employmentType: form.employmentType,
                    workMode: form.workMode,
                },
                designWorks: [],
                orderIndex: Number(form.orderIndex) || 0,
            };

            if (editingId) {
                await updateExperience(editingId, payload);
                showSuccess('Poste mis à jour');
            } else {
                await createExperience(payload);
                showSuccess('Nouveau poste ajouté');
            }

            setShowForm(false);
            resetForm();
            fetchAll();
        } catch (err) {
            setError(err.message || "Erreur lors de l'enregistrement du poste");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setDeleting(id);
            await deleteExperience(id);
            showSuccess('Poste supprimé');
            fetchAll();
        } catch (err) {
            setError(err.message || 'Erreur lors de la suppression');
        } finally {
            setDeleting(null);
        }
    };

    const moveOrder = async (index, direction) => {
        const targetIdx = index + direction;
        if (targetIdx < 0 || targetIdx >= experiences.length) return;
        const current = experiences[index];
        const swap = experiences[targetIdx];
        try {
            await Promise.all([
                updateExperience(current.id, { orderIndex: targetIdx }),
                updateExperience(swap.id, { orderIndex: index }),
            ]);
            fetchAll();
        } catch (err) {
            setError(err.message || "Impossible de réorganiser l'ordre");
        }
    };

    return (
        <div className="font-poppins">
            {/* Messages d'état */}
            {successMsg && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                    <span>{successMsg}</span>
                </div>
            )}
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* Barre d'action supérieure */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaBriefcase className="text-emerald-400" />
                        Postes Occupés ({experiences.length})
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Gérez vos postes (intitulé, entreprise, dates, temps plein/partiel et mode présentiel/en ligne/hybride).
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-colors text-sm"
                >
                    <FaPlus /> Ajouter un poste
                </button>
            </div>

            {/* Liste des postes */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((n) => (
                        <div key={n} className="h-32 bg-gray-900 border border-gray-800 rounded-xl animate-pulse p-5" />
                    ))}
                </div>
            ) : experiences.length === 0 ? (
                <div className="text-center py-14 bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                    <FaBriefcase className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-300 font-semibold mb-1">Aucun poste enregistré</p>
                    <p className="text-gray-500 text-xs max-w-md mx-auto mb-5">
                        Ajoutez vos postes pour alimenter l&apos;histogramme de la page Home.
                    </p>
                    <button
                        onClick={openCreate}
                        className="px-4 py-2 bg-emerald-500 text-zinc-950 font-semibold rounded-lg text-xs hover:bg-emerald-400 transition-colors"
                    >
                        Créer mon premier poste
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {experiences.map((exp, idx) => {
                        const periodText = `${exp.startDate || ''} — ${exp.isCurrent ? 'Présent' : exp.endDate || '—'}`;
                        const empLabel = EMPLOYMENT_LABELS[exp.metrics?.employmentType] || 'Temps plein';
                        const modeLabel = WORK_MODE_LABELS[exp.metrics?.workMode] || 'En présentiel';
                        const barWidth = exp.metrics?.impactScore || computeScoreFromDates(exp.startDate, exp.endDate, exp.isCurrent);

                        return (
                            <div
                                key={exp.id}
                                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                            {periodText}
                                        </span>
                                        {exp.isCurrent && (
                                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold uppercase">
                                                En poste
                                            </span>
                                        )}
                                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                                            {empLabel}
                                        </span>
                                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                            {modeLabel}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-white truncate">
                                        {exp.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                                        {exp.company}
                                    </p>

                                    {/* Aperçu de la barre d'histogramme */}
                                    <div className="mt-3 max-w-md">
                                        <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                                            <div
                                                style={{ width: `${barWidth}%` }}
                                                className="h-full bg-emerald-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions CRUD & Ordre */}
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <div className="flex flex-col gap-1 mr-1">
                                        <button
                                            type="button"
                                            onClick={() => moveOrder(idx, -1)}
                                            disabled={idx === 0}
                                            className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30"
                                            title="Monter"
                                        >
                                            <FaArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveOrder(idx, 1)}
                                            disabled={idx === experiences.length - 1}
                                            className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30"
                                            title="Descendre"
                                        >
                                            <FaArrowDown className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openEdit(exp)}
                                        className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs flex items-center gap-1.5 transition-colors"
                                    >
                                        <FaEdit /> Modifier
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(exp.id)}
                                        disabled={deleting === exp.id}
                                        className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs flex items-center gap-1.5 transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de création / édition de poste */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    {editingId ? 'Modifier le poste' : 'Nouveau poste occupé'}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    Informations clés du poste, période et modalités de travail
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="p-2 text-gray-400 hover:text-white rounded-lg bg-gray-800"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* 1. Intitulé du poste */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                                    Intitulé du poste *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Ex: Ingénieur Logiciel Full-Stack / UI Designer"
                                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* 2. Entreprise */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                                    Entreprise / Organisation *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                    placeholder="Ex: Nom de l'entreprise ou studio"
                                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* 3. Dates de début / fin + Checkbox "Je travaille toujours là-bas" */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                                        Date de début *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                        placeholder="Ex: Janvier 2024 ou 2024"
                                        className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                                        Date de fin {form.isCurrent ? '(En cours)' : '*'}
                                    </label>
                                    <input
                                        type="text"
                                        required={!form.isCurrent}
                                        disabled={form.isCurrent}
                                        value={form.isCurrent ? '' : form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                        placeholder={form.isCurrent ? 'Présent' : 'Ex: Décembre 2024'}
                                        className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-950 border border-gray-800 cursor-pointer hover:border-emerald-500/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={form.isCurrent}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            isCurrent: e.target.checked,
                                            endDate: e.target.checked ? '' : form.endDate,
                                        })
                                    }
                                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                                />
                                <span className="text-sm text-gray-200">
                                    Je travaille toujours là-bas (Poste actuel)
                                </span>
                            </label>

                            {/* 4. Type d'emploi : Temps plein / Temps partiel */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                                    Type de poste *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {EMPLOYMENT_TYPES.map((type) => {
                                        const active = form.employmentType === type.value;
                                        return (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setForm({ ...form, employmentType: type.value })}
                                                className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-colors ${
                                                    active
                                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                                                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                                                }`}
                                            >
                                                {type.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 5. Mode de travail : En présentiel / En ligne / Hybride */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                                    Mode de travail *
                                </label>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {WORK_MODES.map((mode) => {
                                        const active = form.workMode === mode.value;
                                        return (
                                            <button
                                                key={mode.value}
                                                type="button"
                                                onClick={() => setForm({ ...form, workMode: mode.value })}
                                                className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-colors ${
                                                    active
                                                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-semibold'
                                                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                                                }`}
                                            >
                                                {mode.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors disabled:opacity-50"
                                >
                                    {submitting
                                        ? 'Enregistrement...'
                                        : editingId
                                        ? 'Enregistrer'
                                        : 'Ajouter le poste'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
