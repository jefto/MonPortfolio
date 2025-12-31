import { useEffect, useState } from 'react';

/**
 * Texte qui s'écrit comme dans un terminal avec curseur clignotant
 * @param {string} text - Texte à afficher
 * @param {number} delay - Délai entre chaque caractère en ms
 */
export default function TerminalText({ text, delay = 100 }) {
    const [displayedText, setDisplayedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(timer);
            }
        }, delay);

        return () => clearInterval(timer);
    }, [text, delay]);

    useEffect(() => {
        const cursorTimer = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorTimer);
    }, []);

    return (
        <span>
            {displayedText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400 transition-opacity`}>▊</span>
        </span>
    );
}

