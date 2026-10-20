import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UNIVERSES = [
    {
        id: 'home',
        path: '/',
        code: '01',
        label: 'Vue Globale',
    },
    {
        id: 'dev',
        path: '/dev',
        code: '02',
        label: 'Engineering',
    },
    {
        id: 'design',
        path: '/design',
        code: '03',
        label: 'Design Studio',
    },
];

export default function Navbar({ variant = 'light' }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isDark = variant === 'dark';

    const getActiveUniverse = () => {
        if (location.pathname.startsWith('/dev')) return 'dev';
        if (location.pathname.startsWith('/design')) return 'design';
        return 'home';
    };

    const activeId = getActiveUniverse();

    const scrollToSection = (sectionId) => {
        setMobileOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
            return;
        }
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-colors duration-300 border-b ${
                isDark
                    ? 'bg-black/85 border-green-500/25 text-green-400'
                    : 'bg-[#FAF8F5]/90 border-zinc-200/80 text-zinc-900'
            } backdrop-blur-md`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
                {/* Brand Identity */}
                <Link
                    to="/"
                    className="flex items-center gap-3 group focus:outline-none"
                >
                    <div
                        className={`w-9 h-9 flex items-center justify-center font-mono text-xs font-bold tracking-tighter border rounded transition-colors ${
                            isDark
                                ? 'bg-black border-green-500/50 text-green-400 group-hover:bg-green-500 group-hover:text-black shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                                : 'bg-zinc-950 border-zinc-950 text-white group-hover:bg-blue-600 group-hover:border-blue-600'
                        }`}
                    >
                        TJ
                    </div>
                    <div className="flex flex-col">
                        <span
                            className={`font-bold tracking-tight text-sm leading-none ${
                                isDark ? 'text-green-400 font-mono' : 'text-zinc-950'
                            }`}
                        >
                            TCHAMIE JEPHTE
                        </span>
                        <span
                            className={`font-mono text-[10px] tracking-widest uppercase mt-1 ${
                                isDark ? 'text-green-500/60' : 'text-zinc-500'
                            }`}
                        >
                            SOFTWARE ENG. &amp; PRODUCT DESIGN
                        </span>
                    </div>
                </Link>

                {/* Central Universe Segmented Switcher */}
                <nav
                    aria-label="Navigation des univers"
                    className={`hidden md:flex items-center p-1 rounded-full border ${
                        isDark
                            ? 'bg-black/90 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.08)]'
                            : 'bg-zinc-200/70 border-zinc-300/80'
                    }`}
                >
                    {UNIVERSES.map((u) => {
                        const isActive = activeId === u.id;
                        return (
                            <Link
                                key={u.id}
                                to={u.path}
                                className={`relative px-5 py-2 rounded-full text-xs font-medium transition-colors flex items-center gap-2 ${
                                    isActive
                                        ? isDark
                                            ? 'text-black font-bold font-mono'
                                            : 'text-white font-semibold'
                                        : isDark
                                        ? 'text-green-500/70 hover:text-green-300 font-mono'
                                        : 'text-zinc-700 hover:text-zinc-950'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="universeActivePill"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 32,
                                        }}
                                        className={`absolute inset-0 rounded-full ${
                                            u.id === 'dev'
                                                ? isDark
                                                    ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.45)]'
                                                    : 'bg-zinc-950'
                                                : u.id === 'design'
                                                ? 'bg-amber-600'
                                                : isDark
                                                ? 'bg-green-400'
                                                : 'bg-blue-600'
                                        }`}
                                    />
                                )}
                                <span className="relative z-10 font-mono text-[10px] opacity-75">
                                    {u.code}
                                </span>
                                <span className="relative z-10 tracking-tight">{u.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Anchors & CTA */}
                <div className="hidden xl:flex items-center gap-5 text-xs font-medium">
                    <button
                        type="button"
                        onClick={() => scrollToSection('experience-spectrum')}
                        className={`transition-colors ${
                            isDark
                                ? 'text-green-500/70 hover:text-green-300 font-mono'
                                : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                    >
                        Postes &amp; Design
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollToSection('volunteering-section')}
                        className={`transition-colors ${
                            isDark
                                ? 'text-green-500/70 hover:text-green-300 font-mono'
                                : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                    >
                        Bénévolat
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollToSection('education-section')}
                        className={`transition-colors ${
                            isDark
                                ? 'text-green-500/70 hover:text-green-300 font-mono'
                                : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                    >
                        Formation
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollToSection('contact-section')}
                        className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider border transition-all ${
                            isDark
                                ? 'border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black'
                                : 'border-zinc-900 bg-zinc-900 text-white hover:bg-blue-600 hover:border-blue-600'
                        }`}
                    >
                        Contact
                    </button>
                </div>

                {/* Mobile Switcher & Menu Trigger */}
                <div className="flex md:hidden items-center gap-2">
                    <Link
                        to="/dev"
                        className={`px-2.5 py-1.5 rounded text-[11px] font-mono font-semibold border ${
                            activeId === 'dev'
                                ? 'bg-green-500 text-black border-green-500'
                                : isDark
                                ? 'border-green-500/30 text-green-400'
                                : 'border-zinc-300 text-zinc-800'
                        }`}
                    >
                        DEV
                    </Link>
                    <Link
                        to="/design"
                        className={`px-2.5 py-1.5 rounded text-[11px] font-mono font-semibold border ${
                            activeId === 'design'
                                ? 'bg-amber-600 text-white border-amber-600'
                                : isDark
                                ? 'border-green-500/30 text-green-400'
                                : 'border-zinc-300 text-zinc-800'
                        }`}
                    >
                        DESIGN
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                        className={`p-2 rounded border ${
                            isDark ? 'border-green-500/30 text-green-400' : 'border-zinc-300 text-zinc-800'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className={`md:hidden border-b px-4 py-5 space-y-3 ${
                            isDark
                                ? 'bg-black/95 border-green-500/30 text-green-400'
                                : 'bg-[#FAF8F5] border-zinc-200 text-zinc-900'
                        }`}
                    >
                        <div className="grid grid-cols-1 gap-2">
                            {UNIVERSES.map((u) => (
                                <Link
                                    key={u.id}
                                    to={u.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium ${
                                        activeId === u.id
                                            ? isDark
                                                ? 'bg-green-500 text-black border-green-500 font-bold'
                                                : 'bg-zinc-900 text-white border-zinc-900'
                                            : isDark
                                            ? 'border-green-500/30 text-green-400'
                                            : 'border-zinc-300/70'
                                    }`}
                                >
                                    <span>
                                        <span className="font-mono text-xs opacity-60 mr-2">{u.code}</span>
                                        {u.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                        <div
                            className={`pt-2 border-t flex flex-wrap gap-3 text-xs ${
                                isDark ? 'border-green-500/20' : 'border-zinc-200/40'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => scrollToSection('experience-spectrum')}
                                className={`px-3 py-2 rounded border font-mono ${
                                    isDark ? 'border-green-500/30 text-green-400' : 'border-zinc-300/60'
                                }`}
                            >
                                Postes &amp; Design
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollToSection('education-section')}
                                className={`px-3 py-2 rounded border font-mono ${
                                    isDark ? 'border-green-500/30 text-green-400' : 'border-zinc-300/60'
                                }`}
                            >
                                Formation
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollToSection('contact-section')}
                                className={`px-3 py-2 rounded font-mono ${
                                    isDark ? 'bg-green-500 text-black font-bold' : 'bg-blue-600 text-white'
                                }`}
                            >
                                Contact
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
