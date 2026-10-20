import React, { useState, useEffect, useRef } from 'react';
import {
    FaUpload,
    FaSave,
    FaUndo,
    FaSearchPlus,
    FaArrowsAltH,
    FaArrowsAltV,
    FaImage,
    FaCheck,
    FaCrosshairs,
} from 'react-icons/fa';
import { HeroFramedPhoto } from '../../components/ui';
import defaultProfilePhoto from '../../assets/tof.jpg';
import {
    getStatistics,
    updateStatistics,
    uploadHeroPhoto,
} from '../../services/api';

export default function HeroPhotoManager() {
    const [photoUrl, setPhotoUrl] = useState('');
    const [scale, setScale] = useState(1.0);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewBlob, setPreviewBlob] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const fileInputRef = useRef(null);

    // Chargement initial des paramètres depuis l'API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const stats = await getStatistics();
                if (stats) {
                    setPhotoUrl(stats.heroPhotoUrl || '');
                    setScale(stats.heroPhotoScale !== undefined ? Number(stats.heroPhotoScale) : 1.0);
                    setX(stats.heroPhotoX !== undefined ? Number(stats.heroPhotoX) : 0);
                    setY(stats.heroPhotoY !== undefined ? Number(stats.heroPhotoY) : 0);
                }
            } catch (err) {
                console.error('Erreur chargement photo hero:', err);
                setErrorMsg('Impossible de charger les réglages actuels.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Gestion du fichier sélectionné
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrorMsg('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
            return;
        }

        setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewBlob(objectUrl);
        setErrorMsg('');
    };

    // Glisser-déposer de fichier
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewBlob(objectUrl);
            setErrorMsg('');
        }
    };

    // Sauvegarde globale (Upload Cloudinary si nouveau fichier + Enregistrement des coordonnées)
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            let finalPhotoUrl = photoUrl;

            // 1. Si un nouveau fichier a été sélectionné, l'uploader sur Cloudinary
            if (selectedFile) {
                const uploadRes = await uploadHeroPhoto(selectedFile);
                if (uploadRes?.heroPhotoUrl) {
                    finalPhotoUrl = uploadRes.heroPhotoUrl;
                    setPhotoUrl(finalPhotoUrl);
                    setSelectedFile(null);
                    setPreviewBlob(null);
                }
            }

            // 2. Mettre à jour les coordonnées de cadrage dans la base de données
            await updateStatistics({
                heroPhotoUrl: finalPhotoUrl || null,
                heroPhotoScale: parseFloat(scale),
                heroPhotoX: parseFloat(x),
                heroPhotoY: parseFloat(y),
            });

            setSuccessMsg('Photo et cadrage enregistrés avec succès !');
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) {
            console.error('Erreur sauvegarde photo hero:', err);
            setErrorMsg(err.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    // Réinitialisation du cadrage
    const resetFraming = () => {
        setScale(1.0);
        setX(0);
        setY(0);
    };

    // Rétablir la photo d'origine
    const resetToDefaultPhoto = () => {
        setPhotoUrl('');
        setSelectedFile(null);
        setPreviewBlob(null);
        resetFraming();
    };

    // Image actuellement affichée dans la prévisualisation
    const displayImage = previewBlob || photoUrl || defaultProfilePhoto;

    if (loading) {
        return (
            <div className="text-center py-16 font-poppins">
                <div className="animate-spin w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">Chargement de la photo et des réglages...</p>
            </div>
        );
    }

    return (
        <div className="font-poppins">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                        Photo de la Hero Section &amp; Cadrage
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1">
                        Remplacez la photo du portrait d'accueil et ajustez avec précision son cadrage (zoom et position) dans les boîtes géométriques.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-950 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm shadow-sm disabled:opacity-50 self-start sm:self-auto"
                >
                    <FaSave />
                    <span>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                </button>
            </div>

            {/* Notifications */}
            {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
                    <FaCheck className="text-emerald-600" />
                    <span>{successMsg}</span>
                </div>
            )}
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Colonne Gauche : Téléchargement & Curseurs de Cadrage */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Boîte 1 : Téléchargement de la photo */}
                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                            <FaImage className="text-blue-600" />
                            <span>1. Remplacer l'image</span>
                        </h3>

                        {/* Zone glisser-déposer */}
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-zinc-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-blue-50/20"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                                <FaUpload className="text-lg" />
                            </div>
                            <p className="text-sm font-medium text-zinc-800">
                                {selectedFile ? (
                                    <span className="text-blue-600 font-semibold">{selectedFile.name} (sélectionné)</span>
                                ) : (
                                    'Cliquez ou glissez une nouvelle photo ici'
                                )}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                                Formats supportés : JPG, PNG, WebP (max 5 Mo)
                            </p>
                        </div>

                        {/* Option URL Cloudinary directe */}
                        <div className="mt-4 pt-4 border-t border-zinc-100">
                            <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                                Ou coller une URL d'image directe (Cloudinary, etc.) :
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={photoUrl}
                                    onChange={(e) => {
                                        setPhotoUrl(e.target.value);
                                        setSelectedFile(null);
                                        setPreviewBlob(null);
                                    }}
                                    placeholder="https://res.cloudinary.com/.../photo.jpg"
                                    className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {(photoUrl || selectedFile) && (
                                    <button
                                        type="button"
                                        onClick={resetToDefaultPhoto}
                                        className="px-3 py-2 text-xs text-zinc-600 hover:text-red-600 border border-zinc-300 hover:border-red-300 rounded-lg transition-colors"
                                        title="Remettre la photo par défaut du portfolio"
                                    >
                                        Photo par défaut
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Boîte 2 : Curseurs de cadrage de précision */}
                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                            <h3 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                                <FaCrosshairs className="text-emerald-600" />
                                <span>2. Cadrage dans les boîtes géométriques</span>
                            </h3>
                            <button
                                type="button"
                                onClick={resetFraming}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-mono"
                            >
                                <FaUndo className="text-[10px]" />
                                <span>Réinitialiser</span>
                            </button>
                        </div>

                        {/* Curseur Zoom / Échelle */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-2">
                                    <FaSearchPlus className="text-blue-500" />
                                    <span>Zoom / Échelle</span>
                                </label>
                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-semibold">
                                    {Math.round(scale * 100)}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0.6"
                                max="2.4"
                                step="0.02"
                                value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
                                <span>60% (Dézoom)</span>
                                <span className="cursor-pointer hover:text-zinc-700" onClick={() => setScale(1.0)}>100% (Normal)</span>
                                <span>240% (Zoom fort)</span>
                            </div>
                        </div>

                        {/* Curseur Position Horizontale X */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-2">
                                    <FaArrowsAltH className="text-emerald-500" />
                                    <span>Déplacement Horizontal (Axe X)</span>
                                </label>
                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-semibold">
                                    {x > 0 ? `+${Math.round(x)}px` : `${Math.round(x)}px`}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-150"
                                max="150"
                                step="1"
                                value={x}
                                onChange={(e) => setX(parseFloat(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
                                <span>← Gauche (-150px)</span>
                                <span className="cursor-pointer hover:text-zinc-700" onClick={() => setX(0)}>Centre (0px)</span>
                                <span>Droite (+150px) →</span>
                            </div>
                        </div>

                        {/* Curseur Position Verticale Y */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-2">
                                    <FaArrowsAltV className="text-amber-500" />
                                    <span>Déplacement Vertical (Axe Y)</span>
                                </label>
                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-semibold">
                                    {y > 0 ? `+${Math.round(y)}px` : `${Math.round(y)}px`}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-150"
                                max="150"
                                step="1"
                                value={y}
                                onChange={(e) => setY(parseFloat(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                            />
                            <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
                                <span>↑ Vers le haut (-150px)</span>
                                <span className="cursor-pointer hover:text-zinc-700" onClick={() => setY(0)}>Centre (0px)</span>
                                <span>Vers le bas (+150px) ↓</span>
                            </div>
                        </div>

                        {/* Boutons d'ajustements rapides */}
                        <div className="pt-3 border-t border-zinc-100">
                            <span className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                                Préréglages rapides :
                            </span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setScale(1.0); setX(0); setY(0); }}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-700 transition-colors"
                                >
                                    Position standard (100%)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setScale(1.25); setX(0); setY(-20); }}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-700 transition-colors"
                                >
                                    Focus visage haut (+25%)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setScale(1.4); setX(0); setY(-35); }}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-700 transition-colors"
                                >
                                    Portrait serré (+40%)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colonne Droite : Aperçu Visuel en Temps Réel dans les boîtes */}
                <div className="lg:col-span-5 sticky top-24">
                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
                            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                                APERÇU RÉEL DANS LE HERO
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Rendu direct SVG
                            </span>
                        </div>

                        {/* Rendu SVG identique à la Hero Section */}
                        <div className="flex justify-center items-center py-4 bg-[#FAF8F5] rounded-xl border border-zinc-100">
                            <HeroFramedPhoto
                                src={displayImage}
                                scale={scale}
                                x={x}
                                y={y}
                                interactive={false}
                                className="w-72 sm:w-80"
                                id="admin_preview"
                            />
                        </div>

                        <div className="mt-4 pt-4 border-t border-zinc-100 text-xs font-mono text-zinc-500 space-y-1">
                            <p>Échelle : <span className="text-zinc-900 font-semibold">{scale}x</span></p>
                            <p>Offset X / Y : <span className="text-zinc-900 font-semibold">{Math.round(x)}px / {Math.round(y)}px</span></p>
                            <p className="text-[11px] text-zinc-400 mt-2">
                                Ce rendu est exactement celui qui apparaîtra aux visiteurs sur la page d'accueil.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
