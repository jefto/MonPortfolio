import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaTrash, FaFileAlt, FaDownload } from 'react-icons/fa';
import { getCV, getCVUrl, uploadCV, deleteCV } from '../../services/api';

export default function CVManager() {
    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef();

    const fetchCV = async () => {
        try {
            setLoading(true);
            const data = await getCV();
            setCv(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCV(); }, []);

    const handleUpload = async (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setError('Seuls les fichiers PDF sont acceptés');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Le fichier ne doit pas dépasser 10 Mo');
            return;
        }

        setUploading(true);
        setError('');
        try {
            const data = await uploadCV(file);
            setCv(data);
            showSuccess(cv ? 'CV remplacé avec succès !' : 'CV uploadé avec succès !');
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        handleUpload(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleUpload(file);
    };

    const handleDeleteCV = async () => {
        if (!window.confirm('Supprimer le CV ? Le bouton "Download CV" sera désactivé sur le site.')) return;
        setDeleting(true);
        setError('');
        try {
            await deleteCV();
            setCv(null);
            showSuccess('CV supprimé');
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const cvUrl = cv ? getCVUrl(cv) : null;

    const formatDate = (isoStr) => {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion du CV</h2>

            {/* Messages */}
            {successMsg && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{successMsg}</div>
            )}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            {loading ? (
                <div className="text-center py-16">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Chargement...</p>
                </div>
            ) : (
                <div className="max-w-xl">
                    {/* CV actuel */}
                    {cv ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FaFileAlt className="text-red-500 text-xl" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 text-sm truncate">{cv.originalName}</h3>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Uploadé le {formatDate(cv.updatedAt || cv.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                                <a
                                    href={cvUrl}
                                    download={cv.originalName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                    <FaDownload className="text-xs" /> Télécharger le CV
                                </a>
                                <button onClick={handleDeleteCV} disabled={deleting}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50">
                                    <FaTrash className="text-xs" /> {deleting ? 'Suppression...' : 'Supprimer'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                            <p className="text-yellow-700 text-sm">
                                ⚠️ Aucun CV uploadé. Le bouton "Download CV" sur le site est désactivé.
                            </p>
                        </div>
                    )}

                    {/* Zone d'upload */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                            dragOver
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50'
                        }`}
                        onClick={() => fileRef.current?.click()}
                    >
                        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden"
                            onChange={handleFileChange} />

                        {uploading ? (
                            <div>
                                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
                                <p className="text-blue-600 font-medium text-sm">Upload en cours...</p>
                            </div>
                        ) : (
                            <>
                                <FaUpload className="text-3xl text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-700 font-medium text-sm mb-1">
                                    {cv ? 'Remplacer le CV' : 'Uploader votre CV'}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    Glissez-déposez un fichier PDF ici, ou cliquez pour parcourir
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                    Format PDF uniquement • Max 10 Mo
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}



