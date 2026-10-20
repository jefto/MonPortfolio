import GlowingCard from './GlowingCard';

/**
 * Carte de compétence — Style Terminal / Matrix (sans pourcentage de maîtrise)
 * @param {string} skill - Nom de la compétence
 * @param {string} icon - Icône optionnelle
 */
export default function SkillCard({ skill, icon }) {
    return (
        <GlowingCard className="px-4 py-3.5 group flex items-center justify-between">
            <h3 className="text-green-400 font-mono text-sm sm:text-base group-hover:text-green-300 flex items-center gap-2">
                {icon && <span>{icon}</span>}
                <span>{`> ${skill}`}</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-green-500/70 group-hover:bg-green-400 transition-colors" />
        </GlowingCard>
    );
}
