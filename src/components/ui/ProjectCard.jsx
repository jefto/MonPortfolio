import { motion } from 'framer-motion';
import AnimatedButton from './AnimatedButton';

/**
 * Carte de projet avec image, description et lien - Style Matrix
 * @param {Object} project - Données du projet
 * @param {string} project.name - Nom du projet
 * @param {string} project.description - Description du projet
 * @param {string} project.image - URL de l'image
 * @param {string} project.date - Date de réalisation
 * @param {string} project.client - Nom du client
 * @param {string} project.link - Lien vers le projet
 * @param {Array} project.technologies - Technologies utilisées
 */
export default function ProjectCard({ project }) {
    return (
        <motion.div
            className="border border-green-500/30 bg-black/80 backdrop-blur-sm rounded-lg
                       overflow-hidden hover:border-green-400 hover:shadow-xl hover:shadow-green-500/20
                       transition-all duration-300 group"
            whileHover={{ y: -8 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {/* Image du projet */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/50
                                px-2 py-1 rounded text-xs text-green-400 font-mono">
                    {project.date}
                </div>
            </div>

            {/* Contenu */}
            <div className="p-5">
                <h3 className="text-xl text-green-400 font-bold mb-2 group-hover:text-green-300
                               transition-colors flex items-center gap-2">
                    <span className="text-green-600">{`>`}</span> {project.name}
                </h3>

                <p className="text-green-500/70 text-sm mb-3 line-clamp-3">
                    {project.description}
                </p>

                {/* Technologies utilisées */}
                {project.technologies && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech, index) => (
                            <span
                                key={index}
                                className="text-xs bg-green-900/40 border border-green-500/30
                                           text-green-400 px-2 py-1 rounded"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 mb-4 text-xs">
                    <span className="text-green-600">Client:</span>
                    <span className="text-green-400/80 bg-green-900/30 px-2 py-1 rounded">
                        {project.client}
                    </span>
                </div>

                {/* Bouton Visiter avec effet étoile filante */}
                <AnimatedButton href={project.link} text="Visiter" />
            </div>
        </motion.div>
    );
}

