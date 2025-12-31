import { useEffect, useRef } from 'react';

/**
 * Effet de pluie Matrix en arrière-plan
 * Canvas avec des 0 et 1 qui tombent verticalement
 */
export default function MatrixRain() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Ajuster la taille du canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Configuration de la pluie Matrix
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(1);

        // Caractères à afficher (0 et 1)
        const chars = '01';

        const draw = () => {
            // Effet de fondu noir semi-transparent
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Style du texte
            ctx.fillStyle = '#00ff00';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Caractère aléatoire
                const char = chars[Math.floor(Math.random() * chars.length)];

                // Position du caractère
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Variation de couleur pour effet de profondeur
                const brightness = Math.random();
                if (brightness > 0.95) {
                    ctx.fillStyle = '#ffffff'; // Caractères brillants
                } else if (brightness > 0.8) {
                    ctx.fillStyle = '#00ff00'; // Vert vif
                } else {
                    ctx.fillStyle = `rgba(0, ${150 + Math.random() * 105}, 0, ${0.5 + Math.random() * 0.5})`;
                }

                ctx.fillText(char, x, y);

                // Réinitialiser la colonne aléatoirement
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}

