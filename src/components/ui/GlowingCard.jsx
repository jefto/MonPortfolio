import { motion } from 'framer-motion';

/**
 * Carte avec effet de lueur verte au survol - Style Matrix
 * @param {React.ReactNode} children - Contenu de la carte
 * @param {string} className - Classes CSS additionnelles
 * @param {boolean} hover - Activer l'effet hover (défaut: true)
 */
export default function GlowingCard({ children, className = '', hover = true }) {
    return (
        <motion.div
            className={`
                border border-green-500/30 bg-black/60 backdrop-blur-sm rounded-lg
                ${hover ? 'hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20' : ''}
                transition-all duration-300
                ${className}
            `}
            whileHover={hover ? { scale: 1.02 } : {}}
            whileTap={hover ? { scale: 0.98 } : {}}
        >
            {children}
        </motion.div>
    );
}

