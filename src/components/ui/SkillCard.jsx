import GlowingCard from './GlowingCard';

/**
 * Carte de compétence avec barre de progression - Style Matrix
 * @param {string} skill - Nom de la compétence
 * @param {number} level - Niveau de compétence (0-100)
 * @param {string} icon - Emoji ou icône optionnel
 */
export default function SkillCard({ skill, level, icon }) {
    return (
        <GlowingCard className="p-4 group">
            <h3 className="text-green-400 font-mono text-lg mb-2 group-hover:text-green-300 flex items-center gap-2">
                {icon && <span>{icon}</span>}
                <span>{`> ${skill}`}</span>
            </h3>
            <div className="w-full bg-green-900/30 rounded-full h-2 mb-1">
                <div
                    className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full
                               transition-all duration-1000 ease-out"
                    style={{ width: `${level}%` }}
                />
            </div>
            <span className="text-green-500/70 text-sm font-mono">{level}%</span>
        </GlowingCard>
    );
}

