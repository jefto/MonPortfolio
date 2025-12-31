/**
 * Fenêtre terminal avec barre de titre et contenu
 * @param {React.ReactNode} children - Contenu du terminal
 * @param {string} title - Titre de la fenêtre terminal
 * @param {string} className - Classes CSS additionnelles
 */
export default function TerminalWindow({ children, title = 'terminal', className = '' }) {
    return (
        <div className={`bg-black/90 border border-green-500/30 rounded-lg overflow-hidden ${className}`}>
            {/* Barre de titre */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/20 bg-black/50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-green-500/50 text-sm font-mono">{title}</span>
            </div>

            {/* Contenu */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

