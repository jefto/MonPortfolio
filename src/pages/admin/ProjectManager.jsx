import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaExternalLinkAlt } from 'react-icons/fa';
import { getProjects, createProject, updateProject, deleteProject, getImageUrl } from '../../services/api';

const CATEGORY_OPTIONS = [
    { value: 'projet-dev', label: 'Développement' },
    { value: 'projet-design', label: 'Design' },
];

const TYPE_OPTIONS = {
    'projet-dev': [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'fullstack', label: 'Fullstack' },
        { value: 'mobile', label: 'Mobile' },
        { value: 'desktop', label: 'Desktop' },
    ],
    'projet-design': [
        { value: 'maquette', label: 'Maquette' },
        { value: 'affiche', label: 'Affiche' },
    ],
};

const emptyForm = {
    title: '',
    description: '',
    category: 'projet-dev',
    type: 'frontend',
    technologies: '',
    client: '',
    date: '',
    link: '',
};

export default function ProjectManager() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState('');
    const [screenshotFiles, setScreenshotFiles] = useState([]);
    const [screenshotPreviews, setScreenshotPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [deleting, setDeleting] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const coverRef = useRef();
    const screenshotsRef = useRef();

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setCoverFile(null);
        setCoverPreview('');
        setScreenshotFiles([]);
        setScreenshotPreviews([]);
        setEditingId(null);
        setError('');
    };

    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    const openEdit = (project) => {
        setForm({
            title: project.title || '',
            description: project.description || '',
            category: project.category || 'projet-dev',
            type: project.type || 'frontend',
            technologies: (project.technologies || []).join(', '),
            client: project.client || '',
            date: project.date || '',
            link: project.link || '',
        });
        setCoverPreview(getImageUrl(project.coverImage));
        setScreenshotPreviews((project.screenshots || []).map(getImageUrl));
        setCoverFile(null);
        setScreenshotFiles([]);
        setEditingId(project.id);
        setShowForm(true);
        setError('');
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleScreenshotsChange = (e) => {
        const files = Array.from(e.target.files);
        setScreenshotFiles(files);
        setScreenshotPreviews(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('category', form.category);
            formData.append('type', form.type);
            if (form.client) formData.append('client', form.client);
            if (form.date) formData.append('date', form.date);
            if (form.link) formData.append('link', form.link);

            const techArray = form.technologies
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);
            if (techArray.length > 0) {
                formData.append('technologies', JSON.stringify(techArray));
            }

            if (coverFile) formData.append('coverImage', coverFile);
            screenshotFiles.forEach(f => formData.append('screenshots', f));

            if (editingId) {
                await updateProject(editingId, formData, true);
                showSuccess('Projet modifié avec succès !');
            } else {
                await createProject(formData);
                showSuccess('Projet créé avec succès !');
            }

            setShowForm(false);
            resetForm();
            fetchProjects();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce projet ?')) return;
        setDeleting(id);
        try {
            await deleteProject(id);
            showSuccess('Projet supprimé');
            fetchProjects();
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

    const filteredProjects = filterCategory === 'all'
        ? projects
        : projects.filter(p => p.category === filterCategory);

    const currentTypeOptions = TYPE_OPTIONS[form.category] || [];

    return (
        <div>
            {/* Barre d'outils */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">Projets</h2>
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {projects.length}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Toutes catégories</option>
                        {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <FaPlus className="text-xs" /> Nouveau projet
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
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mb-10">
                        {/* En-tête */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Modifier le projet' : 'Nouveau projet'}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                                <input type="text" required value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Mon super projet" />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea required rows="3" value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                                    placeholder="Description détaillée du projet..." />
                            </div>

                            {/* Catégorie + Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                                    <select required value={form.category}
                                        onChange={(e) => {
                                            const cat = e.target.value;
                                            const firstType = TYPE_OPTIONS[cat]?.[0]?.value || '';
                                            setForm({ ...form, category: cat, type: firstType });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                        {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                    <select required value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                        {currentTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Technologies */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies <span className="text-gray-400">(séparées par des virgules)</span></label>
                                <input type="text" value={form.technologies}
                                    onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="React, Tailwind CSS, Node.js" />
                            </div>

                            {/* Client + Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                                    <input type="text" value={form.client}
                                        onChange={(e) => setForm({ ...form, client: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Nom du client" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                </div>
                            </div>

                            {/* Lien */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lien du projet</label>
                                <input type="url" value={form.link}
                                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="https://monprojet.com" />
                            </div>

                            {/* Image de couverture */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image de couverture {!editingId && '*'}
                                </label>
                                <div className="flex items-center gap-4">
                                    <button type="button" onClick={() => coverRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm">
                                        <FaImage /> Choisir une image
                                    </button>
                                    <input ref={coverRef} type="file" accept="image/*" className="hidden"
                                        onChange={handleCoverChange} />
                                    {coverPreview && (
                                        <img src={coverPreview} alt="Preview" className="h-16 w-24 object-cover rounded-lg border" />
                                    )}
                                </div>
                            </div>

                            {/* Screenshots */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Screenshots <span className="text-gray-400">(max 10)</span>
                                </label>
                                <button type="button" onClick={() => screenshotsRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm">
                                    <FaImage /> Choisir des images
                                </button>
                                <input ref={screenshotsRef} type="file" accept="image/*" multiple className="hidden"
                                    onChange={handleScreenshotsChange} />
                                {screenshotPreviews.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {screenshotPreviews.map((src, i) => (
                                            <img key={i} src={src} alt={`Screenshot ${i+1}`}
                                                className="h-14 w-20 object-cover rounded border" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Boutons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
                                    Annuler
                                </button>
                                <button type="submit" disabled={submitting}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                                    {submitting ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Liste des projets */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Chargement des projets...</p>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <FaCode className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun projet pour le moment</p>
                    <button onClick={openCreate}
                        className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        + Créer le premier projet
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                        <div key={project.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                            {/* Image */}
                            <div className="relative h-40 bg-gray-100 overflow-hidden">
                                {project.coverImage ? (
                                    <img src={getImageUrl(project.coverImage)} alt={project.title}
                                        className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <FaImage className="text-3xl" />
                                    </div>
                                )}
                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                        project.category === 'projet-dev'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-pink-100 text-pink-700'
                                    }`}>
                                        {project.category === 'projet-dev' ? 'Dev' : 'Design'}
                                    </span>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                        {project.type}
                                    </span>
                                </div>
                            </div>

                            {/* Contenu */}
                            <div className="p-4">
                                <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{project.title}</h4>
                                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{project.description}</p>

                                {project.technologies?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {project.technologies.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tech}</span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span className="text-xs text-gray-400">+{project.technologies.length - 3}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">{project.date || '—'}</span>
                                    <div className="flex items-center gap-1">
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer"
                                                className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                                                <FaExternalLinkAlt className="text-xs" />
                                            </a>
                                        )}
                                        <button onClick={() => openEdit(project)}
                                            className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                                            <FaEdit className="text-xs" />
                                        </button>
                                        <button onClick={() => handleDelete(project.id)}
                                            disabled={deleting === project.id}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

