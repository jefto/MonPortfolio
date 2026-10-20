import React from 'react';

/**
 * Composant de composition géométrique SVG de la Hero Section.
 * Découpe une photo dans les différentes boîtes et formes architecturales.
 *
 * @param {string} src         - URL de l'image (Cloudinary, local, etc.)
 * @param {number} scale       - Facteur de zoom (1 = 100%, 1.2 = 120%, etc.)
 * @param {number} x           - Déplacement horizontal en pixels (positif = droite, négatif = gauche)
 * @param {number} y           - Déplacement vertical en pixels (positif = bas, négatif = haut)
 * @param {boolean} interactive - Active les micro-animations au survol (désactivé dans l'éditeur de cadrage)
 * @param {string} className   - Classes CSS pour le conteneur
 * @param {string} id          - Identifiant unique pour le pattern SVG
 */
export default function HeroFramedPhoto({
    src,
    scale = 1,
    x = 0,
    y = 0,
    interactive = true,
    className = "w-80 sm:w-96",
    id = "hero_photo",
}) {
    const patternId = `photoPattern_${id}`;

    // Calcul du centrage du zoom (largeur de référence 320, hauteur de référence 384)
    const imgWidth = 320 * scale;
    const imgHeight = 384 * scale;
    const baseOriginX = (320 - imgWidth) / 2;
    const baseOriginY = (384 - imgHeight) / 2;

    return (
        <div className={`relative ${className}`}>
            <svg
                className="w-full h-full drop-shadow-xl select-none"
                viewBox="0 0 320 384"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <pattern
                        id={patternId}
                        patternUnits="userSpaceOnUse"
                        width="320"
                        height="384"
                    >
                        <g transform={`translate(${x}, ${y})`}>
                            <image
                                href={src}
                                x={baseOriginX}
                                y={baseOriginY}
                                width={imgWidth}
                                height={imgHeight}
                                preserveAspectRatio="xMidYMid slice"
                            />
                        </g>
                    </pattern>
                </defs>

                <style>
                    {interactive
                        ? `
                        .photo-rect-${id} {
                            transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                            cursor: pointer;
                        }
                        .photo-rect-${id}:hover {
                            transform: scale(1.03);
                            transform-origin: center;
                        }
                    `
                        : `
                        .photo-rect-${id} {
                            cursor: default;
                        }
                    `}
                </style>

                {/* Polygone principal haut-gauche */}
                <path
                    className={`photo-rect-${id}`}
                    d="M 18 10
                       L 217 10
                       Q 225 10 225 18
                       L 225 117
                       Q 225 125 217 125
                       L 103 125
                       Q 95 125 95 133
                       L 95 162
                       Q 95 170 87 170
                       L 18 170
                       Q 10 170 10 162
                       L 10 18
                       Q 10 10 18 10
                       Z"
                    fill={`url(#${patternId})`}
                    stroke="#18181B"
                    strokeWidth="2"
                />

                {/* Boîtes & Rectangles géométriques satellites */}
                <rect
                    className={`photo-rect-${id}`}
                    x="15"
                    y="185"
                    width="80"
                    height="90"
                    rx="6"
                    fill={`url(#${patternId})`}
                    stroke="#18181B"
                    strokeWidth="2"
                />
                <rect
                    className={`photo-rect-${id}`}
                    x="115"
                    y="140"
                    width="110"
                    height="90"
                    rx="6"
                    fill={`url(#${patternId})`}
                    stroke="#18181B"
                    strokeWidth="2"
                />
                <rect
                    className={`photo-rect-${id}`}
                    x="115"
                    y="245"
                    width="180"
                    height="85"
                    rx="6"
                    fill={`url(#${patternId})`}
                    stroke="#18181B"
                    strokeWidth="2"
                />
                <rect
                    className={`photo-rect-${id}`}
                    x="240"
                    y="10"
                    width="55"
                    height="70"
                    rx="6"
                    fill={`url(#${patternId})`}
                    stroke="#18181B"
                    strokeWidth="2"
                />
                <rect
                    className={`photo-rect-${id}`}
                    x="240"
                    y="95"
                    width="55"
                    height="135"
                    rx="6"
                    fill={`url(#${patternId})`}
                    stroke="#18181B"
                    strokeWidth="2"
                />
                <rect
                    className={`photo-rect-${id}`}
                    x="15"
                    y="290"
                    width="80"
                    height="40"
                    rx="6"
                    fill={`url(#${patternId})`}
                    stroke="#18181B"
                    strokeWidth="2"
                />
            </svg>
        </div>
    );
}
