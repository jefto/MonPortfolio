import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://tchamie-jephte-portfolio.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/img.png`;
const AUTHOR = 'TCHAMIE Jephte';

/**
 * Composant SEO réutilisable — injecte les meta tags dynamiquement par page.
 *
 * @param {string} title       - Titre de la page
 * @param {string} description - Description pour les moteurs de recherche
 * @param {string} path        - Chemin relatif (ex: "/dev")
 * @param {string} image       - URL de l'image OG (optionnel)
 */
export default function SEO({
    title = `${AUTHOR} — Développeur Web & UI/UX Designer`,
    description = `Portfolio de ${AUTHOR} — Développeur Web Full-Stack et UI/UX Designer basé à Lomé, Togo. React, Node.js, Java, Figma.`,
    path = '/',
    image = DEFAULT_IMAGE,
}) {
    const url = `${SITE_URL}${path}`;
    const fullTitle = title.includes(AUTHOR) ? title : `${title} | ${AUTHOR}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}

