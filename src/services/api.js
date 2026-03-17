const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://portfolio-backend-4mj2.onrender.com";

/**
 * Construit l'URL complète d'une image à partir du chemin relatif retourné par l'API
 * @param {string} path - chemin relatif ex: "uploads/coverImage-xxx.png"
 * @returns {string} URL complète
 */
export const getImageUrl = (path) => {
    if (!path) return "";
    // Si c'est déjà une URL complète (http/https), on la retourne telle quelle
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${BASE_URL}/${path}`;
};

/**
 * Appel API générique avec gestion d'erreurs
 */
const apiCall = async (url, options = {}) => {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!data.success) {
        throw new Error(data.errors?.join(", ") || data.message || "Erreur inconnue");
    }

    return data;
};

// ==========================================
// PROJETS
// ==========================================

/**
 * Récupère tous les projets, avec filtres optionnels
 * @param {Object} filters - { category, type }
 * @returns {Promise<Array>} tableau de projets
 */
export const getProjects = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.type) params.append("type", filters.type);

    const queryString = params.toString();
    const url = `${BASE_URL}/api/projects${queryString ? `?${queryString}` : ""}`;

    const data = await apiCall(url);
    return data.data;
};

/**
 * Récupère un projet par son ID
 * @param {number|string} id
 * @returns {Promise<Object>} objet Project
 */
export const getProjectById = async (id) => {
    const url = `${BASE_URL}/api/projects/${id}`;
    const data = await apiCall(url);
    return data.data;
};

/**
 * Crée un nouveau projet (multipart/form-data)
 * @param {FormData} formData
 * @returns {Promise<Object>} objet Project créé
 */
export const createProject = async (formData) => {
    const data = await apiCall(`${BASE_URL}/api/projects`, {
        method: "POST",
        body: formData,
    });
    return data.data;
};

/**
 * Met à jour un projet existant
 * @param {number|string} id
 * @param {FormData|Object} body - FormData si images, sinon objet JSON
 * @param {boolean} hasFiles - true si on envoie des fichiers
 * @returns {Promise<Object>} objet Project mis à jour
 */
export const updateProject = async (id, body, hasFiles = false) => {
    const options = { method: "PUT" };
    if (hasFiles) {
        options.body = body; // FormData
    } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }
    const data = await apiCall(`${BASE_URL}/api/projects/${id}`, options);
    return data.data;
};

/**
 * Supprime un projet
 * @param {number|string} id
 */
export const deleteProject = async (id) => {
    const data = await apiCall(`${BASE_URL}/api/projects/${id}`, { method: "DELETE" });
    return data;
};

/**
 * Vérifie que l'API est en ligne
 * @returns {Promise<boolean>}
 */
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

/**
 * Récupère toutes les compétences, avec filtres optionnels
 * @param {Object} filters - { category, type }
 * @returns {Promise<Array>} tableau de skills
 */
export const getSkills = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.type) params.append("type", filters.type);

    const queryString = params.toString();
    const url = `${BASE_URL}/api/skills${queryString ? `?${queryString}` : ""}`;

    const data = await apiCall(url);
    return data.data;
};

/**
 * Récupère une compétence par son ID
 * @param {number|string} id
 * @returns {Promise<Object>} objet Skill
 */
export const getSkillById = async (id) => {
    const url = `${BASE_URL}/api/skills/${id}`;
    const data = await apiCall(url);
    return data.data;
};

/**
 * Crée une nouvelle compétence
 * @param {Object} skillData - { name, level, category, type }
 * @returns {Promise<Object>} objet Skill créé
 */
export const createSkill = async (skillData) => {
    const data = await apiCall(`${BASE_URL}/api/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData),
    });
    return data.data;
};

/**
 * Met à jour une compétence
 * @param {number|string} id
 * @param {Object} skillData
 * @returns {Promise<Object>} objet Skill mis à jour
 */
export const updateSkill = async (id, skillData) => {
    const data = await apiCall(`${BASE_URL}/api/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData),
    });
    return data.data;
};

/**
 * Supprime une compétence
 * @param {number|string} id
 */
export const deleteSkill = async (id) => {
    const data = await apiCall(`${BASE_URL}/api/skills/${id}`, { method: "DELETE" });
    return data;
};

// ==========================================
// CV
// ==========================================

/**
 * Récupère les informations du CV actuel
 * @returns {Promise<Object|null>} objet CV ou null si aucun CV
 */
export const getCV = async () => {
    try {
        const data = await apiCall(`${BASE_URL}/api/cv`);
        return data.data;
    } catch (err) {
        // Si 404 (aucun CV), retourner null
        if (err.message === "Aucun CV disponible") return null;
        throw err;
    }
};

/**
 * Construit l'URL de téléchargement du CV
 * Retourne l'URL Cloudinary brute — les transformations (fl_attachment) ne
 * fonctionnent pas sur les ressources de type 'raw'. Le téléchargement est
 * géré par l'attribut HTML download + le Content-Type PDF natif de Cloudinary.
 * @param {Object} cv - objet CV de l'API
 * @returns {string|null} URL brute du PDF
 */
export const getCVUrl = (cv) => {
    if (!cv || !cv.filePath) return null;
    // URL Cloudinary directe — pas de transformation, pas de fl_attachment
    if (cv.filePath.startsWith("http://") || cv.filePath.startsWith("https://")) {
        return cv.filePath;
    }
    return `${BASE_URL}/${cv.filePath}`;
};

/**
 * Upload ou remplace le CV
 * @param {File} pdfFile - fichier PDF
 * @returns {Promise<Object>} objet CV
 */
export const uploadCV = async (pdfFile) => {
    const formData = new FormData();
    formData.append("cv", pdfFile);
    const data = await apiCall(`${BASE_URL}/api/cv`, {
        method: "POST",
        body: formData,
    });
    return data.data;
};

/**
 * Supprime le CV
 */
export const deleteCV = async () => {
    const data = await apiCall(`${BASE_URL}/api/cv`, { method: "DELETE" });
    return data;
};

// ==========================================
// HELPERS DE MAPPING
// ==========================================

/**
 * Formate une date ISO "YYYY-MM-DD" en "MM/YYYY"
 */
const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length >= 2) return `${parts[1]}/${parts[0]}`;
    return dateStr;
};

/**
 * Mappe un projet API vers le format attendu par DevPart
 */
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
    category: project.type, // "frontend", "backend", "fullstack", "mobile", "desktop"
    screenshots: (project.screenshots || []).map(getImageUrl),
});

/**
 * Mappe un projet API vers le format attendu par DesignPart
 */
export const mapToDesignProject = (project) => ({
    id: project.id,
    name: project.title,
    description: project.description,
    image: getImageUrl(project.coverImage),
    date: project.date || "",
    dateDisplay: formatDateDisplay(project.date),
    client: project.client || "",
    link: project.link || "",
    type: project.type, // "maquette" ou "affiche"
    screenshots: (project.screenshots || []).map(getImageUrl),
});

/**
 * Mappe un projet API vers le format attendu par la page de détail
 */
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

/**
 * Mappe un skill API vers le format attendu par les composants SkillCard
 * API: { id, name, level, category, type }
 * Frontend: { skill, level }
 */
export const mapToSkill = (skill) => ({
    skill: skill.name,
    level: skill.level,
});

/**
 * Groupe les skills dev par type et les mappe
 * @param {Array} skills - tableau de skills de l'API
 * @returns {Object} { langages, frameworks, databases, outils }
 */
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

/**
 * Groupe les skills design par type et les mappe
 * @param {Array} skills - tableau de skills de l'API
 * @returns {Object} { design, prototyping, other }
 */
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
