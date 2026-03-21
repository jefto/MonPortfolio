import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCode, FaPalette, FaFileAlt, FaHome, FaPlus, FaSignOutAlt, FaGraduationCap, FaChartBar } from 'react-icons/fa';
import ProjectManager from './ProjectManager';
import SkillManager from './SkillManager';
import CVManager from './CVManager';
import EducationManager from './EducationManager';
import StatisticManager from './StatisticManager';

const tabs = [
    { id: 'projects', label: 'Projets', icon: FaCode },
    { id: 'skills', label: 'Compétences', icon: FaPalette },
    { id: 'cv', label: 'CV', icon: FaFileAlt },
    { id: 'education', label: 'Parcours', icon: FaGraduationCap },
    { id: 'statistics', label: 'Statistiques', icon: FaChartBar },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('projects');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <FaPlus className="text-white text-sm" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800">
                                Admin <span className="text-blue-600">Portfolio</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <FaHome />
                                <span className="text-sm font-medium hidden sm:inline">Voir le site</span>
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-8 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        >
                            <tab.icon className="text-sm" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Contenu */}
                {activeTab === 'projects' && <ProjectManager />}
                {activeTab === 'skills' && <SkillManager />}
                {activeTab === 'cv' && <CVManager />}
                {activeTab === 'education' && <EducationManager />}
                {activeTab === 'statistics' && <StatisticManager />}
            </div>
        </div>
    );
}
