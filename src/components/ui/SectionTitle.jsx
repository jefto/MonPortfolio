import { motion } from 'framer-motion';

/**
 * Titre de section style terminal - Style Matrix
 * @param {string} command - Commande à afficher (ex: "cat skills.json")
 * @param {string} className - Classes CSS additionnelles
 */
export default function SectionTitle({ command, className = '' }) {
    return (
        <motion.h2
            className={`text-2xl text-green-400 mb-6 flex items-center gap-2 ${className}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <span className="text-green-600">$</span> {command}
        </motion.h2>
    );
}

