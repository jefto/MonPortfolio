import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    FaCode,
    FaPalette,
    FaFileAlt,
    FaHome,
    FaPlus,
    FaSignOutAlt,
    FaGraduationCap,
    FaChartBar,
    FaBriefcase,
    FaHandsHelping,
    FaCamera,
} from 'react-icons/fa';
import ProjectManager from './ProjectManager';
import SkillManager from './SkillManager';
import CVManager from './CVManager';
import EducationManager from './EducationManager';
import ExperienceManager from './ExperienceManager';
import VolunteeringManager from './VolunteeringManager';
import StatisticManager from './StatisticManager';
import HeroPhotoManager from './HeroPhotoManager';

const tabs = [
    { id: 'projects', label: 'Projets', icon: FaCode },
    { id: 'experiences', label: 'Postes & Expériences', icon: FaBriefcase },
    { id: 'volunteering', label: 'Bénévolat & Social', icon: FaHandsHelping },
    { id: 'skills', label: 'Compétences', icon: FaPalette },
    { id: 'cv', label: 'CV', icon: FaFileAlt },
    { id: 'education', label: 'Parcours Académique', icon: FaGraduationCap },
    { id: 'statistics', label: 'Statistiques & Contact', icon: FaChartBar },
    { id: 'hero', label: 'Photo Hero & Cadrage', icon: FaCamera },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('projects');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <Helmet>
                <title>Back-Office Administration — TCHAMIE Jephte</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            {/* Header */}
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                                <FaPlus className="text-white text-xs" />
                            </div>
                            <h1 className="text-lg font-bold text-zinc-900 tracking-tight">
                                Back-Office <span className="text-blue-600 font-mono text-sm">/ADMIN</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                            >
                                <FaHome />
                                <span className="text-sm font-medium hidden sm:inline">Voir le site</span>
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Déconnexion"
                            >
                                <FaSignOutAlt />
                                <span className="text-sm font-medium hidden sm:inline">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Onglets */}
                <div className="flex flex-wrap gap-1 bg-white p-1.5 rounded-xl border border-zinc-200 mb-8 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-zinc-900 text-white'
                                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                            }`}
                        >
                            <tab.icon className="text-xs" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Contenu */}
                {activeTab === 'projects' && <ProjectManager />}
                {activeTab === 'experiences' && <ExperienceManager />}
                {activeTab === 'volunteering' && <VolunteeringManager />}
                {activeTab === 'skills' && <SkillManager />}
                {activeTab === 'cv' && <CVManager />}
                {activeTab === 'education' && <EducationManager />}
                {activeTab === 'statistics' && <StatisticManager />}
                {activeTab === 'hero' && <HeroPhotoManager />}
            </div>
        </div>
    );
}
