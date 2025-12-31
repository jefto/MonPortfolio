import { motion } from 'framer-motion';

/**
 * Champ de formulaire style terminal - Style Matrix
 * @param {string} label - Label du champ
 * @param {string} name - Nom du champ
 * @param {string} type - Type du champ (text, email, textarea)
 * @param {string} placeholder - Placeholder
 * @param {string} value - Valeur du champ
 * @param {function} onChange - Fonction de changement
 * @param {boolean} required - Champ requis
 * @param {number} rows - Nombre de lignes (pour textarea)
 */
export default function FormInput({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    rows = 4
}) {
    const baseClasses = `
        w-full bg-black/60 border border-green-500/30 rounded-lg px-4 py-3
        text-green-400 font-mono placeholder-green-700/50
        focus:outline-none focus:border-green-400 focus:shadow-lg focus:shadow-green-500/10
        transition-all duration-300
    `;

    return (
        <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
        >
            <label className="block text-green-400 font-mono text-sm mb-2">
                <span className="text-green-600">{`>`}</span> {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {type === 'textarea' ? (
                <textarea
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows={rows}
                    className={`${baseClasses} resize-none`}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={baseClasses}
                />
            )}
        </motion.div>
    );
}

