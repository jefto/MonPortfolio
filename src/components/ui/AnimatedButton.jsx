import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * Bouton avec effet étoile filante sur les bordures au hover - Style Matrix
 * @param {string} href - Lien du bouton (si lien externe)
 * @param {string} text - Texte du bouton
 * @param {function} onClick - Fonction onClick (si bouton)
 * @param {string} type - Type du bouton (button, submit)
 * @param {boolean} disabled - Désactiver le bouton
 * @param {boolean} showIcon - Afficher l'icône de lien externe
 * @param {string} className - Classes CSS additionnelles
 */
export default function AnimatedButton({
    href,
    text,
    onClick,
    type = 'button',
    disabled = false,
    showIcon = true,
    className = ''
}) {
    const [isHovered, setIsHovered] = useState(false);
    const perimetre = 280;
    const tailleQueue = 80;

    const ButtonContent = () => (
        <>
            {/* Bordure classique */}
            <span className="absolute inset-0 border border-green-500/50 rounded transition-all duration-300 group-hover:border-green-400" />

            {/* SVG pour l'effet étoile filante - visible uniquement au hover */}
            {isHovered && (
                <svg
                    className="absolute inset-0 w-full h-full overflow-visible"
                    style={{ width: '100%', height: '100%' }}
                >
                    <defs>
                        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="60%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#4ade80" />
                        </linearGradient>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Traînée de l'étoile filante */}
                    <motion.rect
                        x="1"
                        y="1"
                        rx="4"
                        ry="4"
                        fill="none"
                        stroke="url(#starGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                            width: 'calc(100% - 2px)',
                            height: 'calc(100% - 2px)',
                            strokeDasharray: `${tailleQueue} ${perimetre + tailleQueue}`,
                        }}
                        animate={{
                            strokeDashoffset: [perimetre + tailleQueue * 2, -tailleQueue]
                        }}
                        transition={{
                            duration: 3,
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                    />

                    {/* Tête lumineuse (étoile) */}
                    <motion.rect
                        x="1"
                        y="1"
                        rx="4"
                        ry="4"
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        style={{
                            width: 'calc(100% - 2px)',
                            height: 'calc(100% - 2px)',
                            strokeDasharray: `4 ${perimetre + tailleQueue}`,
                        }}
                        animate={{
                            strokeDashoffset: [perimetre + tailleQueue * 2, -tailleQueue]
                        }}
                        transition={{
                            duration: 3,
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                    />
                </svg>
            )}

            <span className="relative z-10">{text}</span>
            {showIcon && (
                <svg
                    className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            )}
        </>
    );

    const baseClasses = `
        group relative inline-flex items-center gap-2 px-4 py-2 text-green-400
        font-mono text-sm hover:text-green-300 transition-colors duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
    `;

    const hoverHandlers = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false)
    };

    // Si c'est un lien externe
    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={baseClasses}
                {...hoverHandlers}
            >
                <ButtonContent />
            </a>
        );
    }

    // Sinon c'est un bouton
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={baseClasses}
            {...hoverHandlers}
        >
            <ButtonContent />
        </button>
    );
}

