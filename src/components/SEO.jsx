import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://tchamie-jephte-portfolio.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/img.png`;
const AUTHOR = 'TCHAMIE Jephte';

/**
 * Composant SEO réutilisable — injecte les meta tags dynamiquement par page
 * et gère les balises requises pour l'indexation Google (canonical, Open Graph, Twitter, JSON-LD).
 *
 * @param {string} title       - Titre spécifique de la page
 * @param {string} description - Description concise et optimisée pour les résultats Google
 * @param {string} path        - Chemin relatif (ex: "/dev", "/design")
 * @param {string} image       - URL de l'image de prévisualisation (Open Graph)
 * @param {object} jsonLd      - Données structurées Schema.org spécifiques (optionnel)
 */
export default function SEO({
    title = `${AUTHOR} — Ingénieur Génie Logiciel & Designer UI/UX`,
    description = `Portfolio officiel de ${AUTHOR} — Ingénieur Logiciel Full-Stack et Designer UI/UX basé à Lomé, Togo. Architectures React, Node.js, Java, PostgreSQL et systèmes Figma.`,
    path = '/',
    image = DEFAULT_IMAGE,
    jsonLd = null,
}) {
    const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    const fullTitle = title.includes(AUTHOR) ? title : `${title} | ${AUTHOR}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="robots" content="index, follow, max-image-preview:large" />
            <meta name="googlebot" content="index, follow" />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="TCHAMIE Jephte Portfolio" />
            <meta property="og:locale" content="fr_FR" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:creator" content="@putamadre2_0" />

            {/* Données structurées JSON-LD de page */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
}
