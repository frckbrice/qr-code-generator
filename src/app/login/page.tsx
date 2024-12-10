"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentLogin() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement authentication logic
        router.push('/dashboard');
    };

    return (
        <div className='min-h-screen flex items-center justify-center '>
            <div className='w-full max-w-xl mx-auto'>
                <form
                    onSubmit={handleLogin}
                    className='bg-cyan-700/[0.5] text-gray-800 shadow-lg rounded-lg p-4 space-y-6'
                >
                    <h2 className="text-2xl font-bold text-center mb-4">Connexion</h2>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Nom d&#39;utilisateur
                        </label>
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cyan-600 text-white p-2 rounded hover:bg-cyan-700 transition duration-300"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}