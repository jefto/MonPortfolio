import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL =
    process.env.REACT_APP_API_URL ||
    'https://portfolio-backend-4mj2.onrender.com';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || 'Identifiants incorrects');
                return;
            }

            localStorage.setItem('admin_token', data.token);
            navigate('/admin', { replace: true });
        } catch {
            setError('Impossible de joindre le serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
                {/* Logo / titre */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 leading-tight">Admin Portfolio</h1>
                        <p className="text-xs text-gray-400">Accès restreint</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                        />
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                        />
                    </div>

                    {/* Erreur */}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    {/* Bouton */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-wait"
                    >
                        {loading ? 'Connexion…' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
}

