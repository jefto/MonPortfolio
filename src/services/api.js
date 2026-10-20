const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://portfolio-backend-4mj2.onrender.com";

const LOCAL_DEV_API = "http://localhost:4000";

const LOCAL_STORAGE_KEYS = {
    experiences: "portfolio_fallback_experiences",
    volunteering: "portfolio_fallback_volunteering",
};

const readLocalCollection = (key) => {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEYS[key]);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const writeLocalCollection = (key, items) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEYS[key], JSON.stringify(items));
    } catch (err) {
        console.warn("Impossible de sauvegarder localement:", err);
    }
};

/**
 * Construit l'URL complète d'une image à partir du chemin relatif retourné par l'API
 * @param {string} path - chemin relatif ex: "uploads/coverImage-xxx.png"
 * @returns {string} URL complète
 */
export const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
        return path;
    }
    return `${BASE_URL}/${path}`;
};

/**
 * Appel API générique avec gestion d'erreurs, injection du token admin,
 * et bascule automatique sur le backend local (localhost:4000) si Render renvoie 404
 * sur les nouvelles routes (/api/experiences, /api/volunteering) avant déploiement.
 */
const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');

    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    let res;
    try {
        res = await fetch(url, { ...options, headers });
    } catch (networkErr) {
        // Si l'URL principale est inaccessible et n'est pas déjà localhost:4000, tenter localhost:4000
        if (!url.startsWith(LOCAL_DEV_API) && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            const pathPart = url.replace(BASE_URL, '');
            res = await fetch(`${LOCAL_DEV_API}${pathPart}`, { ...options, headers });
        } else {
            throw networkErr;
        }
    }

    // Si Render renvoie 404 sur une nouvelle route pas encore déployée sur Render, tenter localhost:4000
    if (
        res.status === 404 &&
        !url.startsWith(LOCAL_DEV_API) &&
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
    ) {
        try {
            const pathPart = url.replace(BASE_URL, '');
            const localRes = await fetch(`${LOCAL_DEV_API}${pathPart}`, { ...options, headers });
            if (localRes.ok || localRes.status !== 404) {
                res = localRes;
            }
        } catch {
            // Ignorer si localhost:4000 n'est pas lancé
        }
    }

    if (res.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
    }

    const data = await res.json();

    if (!data.success) {
        const err = new Error(data.errors?.join(", ") || data.message || "Erreur inconnue");
        err.status = res.status;
        throw err;
    }

    return data;
};

/**
 * Réveil proactif non-bloquant du backend Render et de la base Supabase
 * Déclenché dès le chargement du portfolio dans le navigateur.
 */
export const warmupBackendAndDB = () => {
    if (typeof window === 'undefined') return;
    try {
        fetch(`${BASE_URL}/api/keep-alive`, { method: 'GET', keepalive: true }).catch(() => {});
    } catch {
        // Ignorer silencieusement
    }
};

if (typeof window !== 'undefined') {
    warmupBackendAndDB();
}

// ==========================================
// PROJETS
// ==========================================

export const getProjects = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.type) params.append("type", filters.type);

    const queryString = params.toString();
    const url = `${BASE_URL}/api/projects${queryString ? `?${queryString}` : ""}`;

    const data = await apiCall(url);
    return data.data;
};

export const getProjectById = async (id) => {
    const url = `${BASE_URL}/api/projects/${id}`;
    const data = await apiCall(url);
    return data.data;
};

export const createProject = async (formData) => {
    const data = await apiCall(`${BASE_URL}/api/projects`, {
        method: "POST",
        body: formData,
    });
    return data.data;
};

export const updateProject = async (id, body, hasFiles = false) => {
    const options = { method: "PUT" };
    if (hasFiles) {
        options.body = body;
    } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }
    const data = await apiCall(`${BASE_URL}/api/projects/${id}`, options);
    return data.data;
};

export const deleteProject = async (id) => {
    const data = await apiCall(`${BASE_URL}/api/projects/${id}`, { method: "DELETE" });
    return data;
};

export const checkHealth = async () => {
    try {
        const data = await apiCall(`${BASE_URL}/api/health`);
        return data.success;
    } catch {
        return false;
    }
};

// ==========================================
// COMPÉTENCES (SKILLS)
// ==========================================

export const getSkills = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.type) params.append("type", filters.type);

    const queryString = params.toString();
    const url = `${BASE_URL}/api/skills${queryString ? `?${queryString}` : ""}`;

    const data = await apiCall(url);
    return data.data;
};

export const getSkillById = async (id) => {
    const url = `${BASE_URL}/api/skills/${id}`;
    const data = await apiCall(url);
    return data.data;
};

export const createSkill = async (skillData) => {
    const data = await apiCall(`${BASE_URL}/api/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData),
    });
    return data.data;
};

export const updateSkill = async (id, skillData) => {
    const data = await apiCall(`${BASE_URL}/api/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData),
    });
    return data.data;
};

export const deleteSkill = async (id) => {
    const data = await apiCall(`${BASE_URL}/api/skills/${id}`, { method: "DELETE" });
    return data;
};

// ==========================================
// CV
// ==========================================

export const getCV = async () => {
    try {
        const data = await apiCall(`${BASE_URL}/api/cv`);
        return data.data;
    } catch (err) {
        if (err.message === "Aucun CV disponible") return null;
        throw err;
    }
};

export const getCVUrl = (cv) => {
    if (!cv || !cv.filePath) return null;
    if (cv.filePath.startsWith("http://") || cv.filePath.startsWith("https://")) {
        return cv.filePath;
    }
    return `${BASE_URL}/${cv.filePath}`;
};

export const downloadCV = () => {
    window.open(`${BASE_URL}/api/cv/download`, '_blank');
};

export const uploadCV = async (pdfFile) => {
    const formData = new FormData();
    formData.append("cv", pdfFile);
    const data = await apiCall(`${BASE_URL}/api/cv`, {
        method: "POST",
        body: formData,
    });
    return data.data;
};

export const deleteCV = async () => {
    const data = await apiCall(`${BASE_URL}/api/cv`, { method: "DELETE" });
    return data;
};

// ==========================================
// ÉDUCATION (PARCOURS ACADÉMIQUE)
// ==========================================

export const getEducations = async () => {
    const data = await apiCall(`${BASE_URL}/api/educations`);
    return data.data;
};

export const createEducation = async (educationData) => {
    const data = await apiCall(`${BASE_URL}/api/educations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(educationData),
    });
    return data.data;
};

export const updateEducation = async (id, educationData) => {
    const data = await apiCall(`${BASE_URL}/api/educations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(educationData),
    });
    return data.data;
};

export const deleteEducation = async (id) => {
    const data = await apiCall(`${BASE_URL}/api/educations/${id}`, { method: "DELETE" });
    return data;
};

// ==========================================
// POSTES & EXPÉRIENCES (SPECTRE HYBRIDE)
// ==========================================

const parsePayloadObject = (body) => {
    if (body instanceof FormData) {
        const obj = {};
        body.forEach((value, key) => {
            try {
                obj[key] = JSON.parse(value);
            } catch {
                obj[key] = value;
            }
        });
        return obj;
    }
    return body || {};
};

export const getExperiences = async () => {
    try {
        const data = await apiCall(`${BASE_URL}/api/experiences`);
        const apiList = data.data || [];
        if (apiList.length > 0) {
            writeLocalCollection("experiences", apiList);
            return apiList;
        }
        const localList = readLocalCollection("experiences");
        return localList.length > 0 ? localList : apiList;
    } catch {
        return readLocalCollection("experiences");
    }
};

export const getExperienceById = async (id) => {
    try {
        const data = await apiCall(`${BASE_URL}/api/experiences/${id}`);
        return data.data;
    } catch {
        const list = readLocalCollection("experiences");
        return list.find((item) => String(item.id) === String(id)) || null;
    }
};

export const createExperience = async (body, hasFiles = false) => {
    const options = { method: "POST" };
    if (hasFiles || body instanceof FormData) {
        options.body = body;
    } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }

    try {
        const data = await apiCall(`${BASE_URL}/api/experiences`, options);
        return data.data;
    } catch (err) {
        if (err.status === 404 || err.message === "Route non trouvée" || err.message.includes("Failed to fetch")) {
            const parsed = parsePayloadObject(body);
            const list = readLocalCollection("experiences");
            const newItem = {
                id: Date.now(),
                ...parsed,
                createdAt: new Date().toISOString(),
            };
            const updated = [...list, newItem];
            writeLocalCollection("experiences", updated);
            return newItem;
        }
        throw err;
    }
};

export const updateExperience = async (id, body, hasFiles = false) => {
    const options = { method: "PUT" };
    if (hasFiles || body instanceof FormData) {
        options.body = body;
    } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }

    try {
        const data = await apiCall(`${BASE_URL}/api/experiences/${id}`, options);
        return data.data;
    } catch (err) {
        if (err.status === 404 || err.message === "Route non trouvée" || err.message.includes("Failed to fetch")) {
            const parsed = parsePayloadObject(body);
            const list = readLocalCollection("experiences");
            const updated = list.map((item) =>
                String(item.id) === String(id) ? { ...item, ...parsed, updatedAt: new Date().toISOString() } : item
            );
            writeLocalCollection("experiences", updated);
            return updated.find((item) => String(item.id) === String(id));
        }
        throw err;
    }
};

export const deleteExperience = async (id) => {
    try {
        const data = await apiCall(`${BASE_URL}/api/experiences/${id}`, { method: "DELETE" });
        const list = readLocalCollection("experiences").filter((item) => String(item.id) !== String(id));
        writeLocalCollection("experiences", list);
        return data;
    } catch (err) {
        if (err.status === 404 || err.message === "Route non trouvée" || err.message.includes("Failed to fetch")) {
            const list = readLocalCollection("experiences").filter((item) => String(item.id) !== String(id));
            writeLocalCollection("experiences", list);
            return { success: true };
        }
        throw err;
    }
};

// ==========================================
// BÉNÉVOLAT & ENGAGEMENT SOCIAL (VOLUNTEERING)
// ==========================================

export const getVolunteerings = async () => {
    try {
        const data = await apiCall(`${BASE_URL}/api/volunteering`);
        const apiList = data.data || [];
        if (apiList.length > 0) {
            writeLocalCollection("volunteering", apiList);
            return apiList;
        }
        const localList = readLocalCollection("volunteering");
        return localList.length > 0 ? localList : apiList;
    } catch {
        return readLocalCollection("volunteering");
    }
};

export const getVolunteeringById = async (id) => {
    try {
        const data = await apiCall(`${BASE_URL}/api/volunteering/${id}`);
        return data.data;
    } catch {
        const list = readLocalCollection("volunteering");
        return list.find((item) => String(item.id) === String(id)) || null;
    }
};

export const createVolunteering = async (body, hasFiles = false) => {
    const options = { method: "POST" };
    if (hasFiles || body instanceof FormData) {
        options.body = body;
    } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }

    try {
        const data = await apiCall(`${BASE_URL}/api/volunteering`, options);
        return data.data;
    } catch (err) {
        if (err.status === 404 || err.message === "Route non trouvée" || err.message.includes("Failed to fetch")) {
            const parsed = parsePayloadObject(body);
            const list = readLocalCollection("volunteering");
            const newItem = {
                id: Date.now(),
                ...parsed,
                createdAt: new Date().toISOString(),
            };
            const updated = [...list, newItem];
            writeLocalCollection("volunteering", updated);
            return newItem;
        }
        throw err;
    }
};

export const updateVolunteering = async (id, body, hasFiles = false) => {
    const options = { method: "PUT" };
    if (hasFiles || body instanceof FormData) {
        options.body = body;
    } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }

    try {
        const data = await apiCall(`${BASE_URL}/api/volunteering/${id}`, options);
        return data.data;
    } catch (err) {
        if (err.status === 404 || err.message === "Route non trouvée" || err.message.includes("Failed to fetch")) {
            const parsed = parsePayloadObject(body);
            const list = readLocalCollection("volunteering");
            const updated = list.map((item) =>
                String(item.id) === String(id) ? { ...item, ...parsed, updatedAt: new Date().toISOString() } : item
            );
            writeLocalCollection("volunteering", updated);
            return updated.find((item) => String(item.id) === String(id));
        }
        throw err;
    }
};

export const deleteVolunteering = async (id) => {
    try {
        const data = await apiCall(`${BASE_URL}/api/volunteering/${id}`, { method: "DELETE" });
        const list = readLocalCollection("volunteering").filter((item) => String(item.id) !== String(id));
        writeLocalCollection("volunteering", list);
        return data;
    } catch (err) {
        if (err.status === 404 || err.message === "Route non trouvée" || err.message.includes("Failed to fetch")) {
            const list = readLocalCollection("volunteering").filter((item) => String(item.id) !== String(id));
            writeLocalCollection("volunteering", list);
            return { success: true };
        }
        throw err;
    }
};

// ==========================================
// STATISTIQUES, COORDONNÉES & PHOTO HERO
// ==========================================

export const DEFAULT_CONTACT_INFO = {
    contactPhone: "+228 91 02 01 71",
    contactEmail: "jefftchamie@gmail.com",
    contactLocation: "Lomé, Togo",
    heroPhotoUrl: "",
    heroPhotoScale: 1.0,
    heroPhotoX: 0.0,
    heroPhotoY: 0.0,
};

const CONTACT_STORAGE_KEY = "portfolio_contact_info";

const readLocalContactInfo = () => {
    try {
        const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const writeLocalContactInfo = (info) => {
    try {
        const current = readLocalContactInfo();
        const merged = {
            ...current,
            ...(info.contactPhone !== undefined ? { contactPhone: info.contactPhone } : {}),
            ...(info.contactEmail !== undefined ? { contactEmail: info.contactEmail } : {}),
            ...(info.contactLocation !== undefined ? { contactLocation: info.contactLocation } : {}),
            ...(info.heroPhotoUrl !== undefined ? { heroPhotoUrl: info.heroPhotoUrl } : {}),
            ...(info.heroPhotoScale !== undefined ? { heroPhotoScale: info.heroPhotoScale } : {}),
            ...(info.heroPhotoX !== undefined ? { heroPhotoX: info.heroPhotoX } : {}),
            ...(info.heroPhotoY !== undefined ? { heroPhotoY: info.heroPhotoY } : {}),
        };
        localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(merged));
    } catch {
        // Ignorer
    }
};

export const formatWhatsAppUrl = (phone) => {
    const raw = String(phone || DEFAULT_CONTACT_INFO.contactPhone);
    let digits = raw.replace(/\D/g, "");
    if (!digits) digits = "22891020171";
    if (digits.length === 8) digits = `228${digits}`;
    return `https://wa.me/${digits}`;
};

export const uploadHeroPhoto = async (file) => {
    const formData = new FormData();
    formData.append('heroPhoto', file);
    try {
        const data = await apiCall(`${BASE_URL}/api/statistics/hero-photo`, {
            method: 'POST',
            body: formData,
        });
        if (data.data?.heroPhotoUrl) {
            writeLocalContactInfo({ heroPhotoUrl: data.data.heroPhotoUrl });
        }
        return data.data;
    } catch (err) {
        // Fallback local en cas d'indisponibilité temporaire
        const previewUrl = URL.createObjectURL(file);
        writeLocalContactInfo({ heroPhotoUrl: previewUrl });
        return {
            heroPhotoUrl: previewUrl,
            heroPhotoScale: 1.0,
            heroPhotoX: 0,
            heroPhotoY: 0,
        };
    }
};

export const getStatistics = async () => {
    const localContact = readLocalContactInfo();
    try {
        const data = await apiCall(`${BASE_URL}/api/statistics`);
        const serverStats = data.data || {};
        return {
            ...DEFAULT_CONTACT_INFO,
            ...localContact,
            ...serverStats,
            contactPhone: serverStats.contactPhone || localContact.contactPhone || DEFAULT_CONTACT_INFO.contactPhone,
            contactEmail: serverStats.contactEmail || localContact.contactEmail || DEFAULT_CONTACT_INFO.contactEmail,
            contactLocation: serverStats.contactLocation || localContact.contactLocation || DEFAULT_CONTACT_INFO.contactLocation,
            heroPhotoUrl: serverStats.heroPhotoUrl ?? localContact.heroPhotoUrl ?? DEFAULT_CONTACT_INFO.heroPhotoUrl,
            heroPhotoScale: serverStats.heroPhotoScale !== undefined ? Number(serverStats.heroPhotoScale) : (localContact.heroPhotoScale !== undefined ? Number(localContact.heroPhotoScale) : DEFAULT_CONTACT_INFO.heroPhotoScale),
            heroPhotoX: serverStats.heroPhotoX !== undefined ? Number(serverStats.heroPhotoX) : (localContact.heroPhotoX !== undefined ? Number(localContact.heroPhotoX) : DEFAULT_CONTACT_INFO.heroPhotoX),
            heroPhotoY: serverStats.heroPhotoY !== undefined ? Number(serverStats.heroPhotoY) : (localContact.heroPhotoY !== undefined ? Number(localContact.heroPhotoY) : DEFAULT_CONTACT_INFO.heroPhotoY),
        };
    } catch {
        return {
            completedProjects: 10,
            yearsExperience: 3,
            masteredTechnologies: 18,
            mockupsCreated: 5,
            postersDesigned: 4,
            masteredSoftware: 4,
            ...DEFAULT_CONTACT_INFO,
            ...localContact,
        };
    }
};

export const updateStatistics = async (statsData) => {
    writeLocalContactInfo(statsData);
    let serverData = {};
    try {
        const data = await apiCall(`${BASE_URL}/api/statistics`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(statsData),
        });
        serverData = data.data || {};
    } catch (err) {
        console.warn("Mise à jour distante échouée, conservation locale :", err);
    }
    const localContact = readLocalContactInfo();
    return {
        ...DEFAULT_CONTACT_INFO,
        ...localContact,
        ...serverData,
        contactPhone: serverData.contactPhone || statsData.contactPhone || localContact.contactPhone || DEFAULT_CONTACT_INFO.contactPhone,
        contactEmail: serverData.contactEmail || statsData.contactEmail || localContact.contactEmail || DEFAULT_CONTACT_INFO.contactEmail,
        contactLocation: serverData.contactLocation || statsData.contactLocation || localContact.contactLocation || DEFAULT_CONTACT_INFO.contactLocation,
        heroPhotoUrl: serverData.heroPhotoUrl ?? statsData.heroPhotoUrl ?? localContact.heroPhotoUrl ?? DEFAULT_CONTACT_INFO.heroPhotoUrl,
        heroPhotoScale: statsData.heroPhotoScale !== undefined ? Number(statsData.heroPhotoScale) : (serverData.heroPhotoScale !== undefined ? Number(serverData.heroPhotoScale) : (localContact.heroPhotoScale !== undefined ? Number(localContact.heroPhotoScale) : DEFAULT_CONTACT_INFO.heroPhotoScale)),
        heroPhotoX: statsData.heroPhotoX !== undefined ? Number(statsData.heroPhotoX) : (serverData.heroPhotoX !== undefined ? Number(serverData.heroPhotoX) : (localContact.heroPhotoX !== undefined ? Number(localContact.heroPhotoX) : DEFAULT_CONTACT_INFO.heroPhotoX)),
        heroPhotoY: statsData.heroPhotoY !== undefined ? Number(statsData.heroPhotoY) : (serverData.heroPhotoY !== undefined ? Number(serverData.heroPhotoY) : (localContact.heroPhotoY !== undefined ? Number(localContact.heroPhotoY) : DEFAULT_CONTACT_INFO.heroPhotoY)),
    };
};

// ==========================================
// HELPERS DE MAPPING
// ==========================================

const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length >= 2) return `${parts[1]}/${parts[0]}`;
    return dateStr;
};

export const mapToDevProject = (project) => ({
    id: project.id,
    name: project.title,
    description: project.description,
    image: getImageUrl(project.coverImage),
    date: project.date || "",
    dateDisplay: formatDateDisplay(project.date),
    client: project.client || "",
    link: project.link || "",
    technologies: project.technologies || [],
    category: project.type,
    screenshots: (project.screenshots || []).map(getImageUrl),
});

export const mapToDesignProject = (project) => ({
    id: project.id,
    name: project.title,
    description: project.description,
    image: getImageUrl(project.coverImage),
    date: project.date || "",
    dateDisplay: formatDateDisplay(project.date),
    client: project.client || "",
    link: project.link || "",
    type: project.type,
    screenshots: (project.screenshots || []).map(getImageUrl),
});

export const mapToDetailProject = (project) => ({
    id: project.id,
    name: project.title,
    description: project.description,
    client: project.client || "",
    date: formatDateDisplay(project.date),
    category: project.category === "projet-dev" ? "Développement" : "Design",
    type: project.type,
    tools: project.technologies || [],
    link: project.link || "",
    gallery: [
        getImageUrl(project.coverImage),
        ...(project.screenshots || []).map(getImageUrl),
    ].filter(Boolean),
    coverImage: getImageUrl(project.coverImage),
});

export const mapToSkill = (skill) => ({
    skill: skill.name,
    level: skill.level,
});

export const groupDevSkills = (skills) => {
    const groups = {
        langages: [],
        frameworks: [],
        databases: [],
        outils: [],
    };

    const typeMap = {
        "langage-de-programmation": "langages",
        "framework": "frameworks",
        "base-de-donnee": "databases",
        "outil": "outils",
    };

    skills.forEach((s) => {
        const key = typeMap[s.type];
        if (key) {
            groups[key].push(mapToSkill(s));
        }
    });

    return groups;
};

export const groupDesignSkills = (skills) => {
    const groups = {
        design: [],
        prototyping: [],
        other: [],
    };

    const typeMap = {
        "design": "design",
        "prototypage": "prototyping",
        "3d": "other",
    };

    skills.forEach((s) => {
        const key = typeMap[s.type];
        if (key) {
            groups[key].push(mapToSkill(s));
        }
    });

    return groups;
};
