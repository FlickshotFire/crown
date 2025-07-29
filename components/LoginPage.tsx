import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const InputField: React.FC<{ id: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, iconClass: string }> = ({ id, type, value, onChange, placeholder, iconClass }) => (
    <div className="relative">
        <i className={`${iconClass} absolute left-3 top-1/2 -translate-y-1/2 text-stone-400`}></i>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-stone-900/50 border-2 border-stone-600 rounded-md py-2 pl-10 pr-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            required
        />
    </div>
);


export const LoginPage: React.FC = () => {
    const { login, signup } = useGame();
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setError('');
        setIsLoading(true);

        try {
            if (isLoginView) {
                await login(username, password);
                // On success, the parent component re-renders, and this component will unmount.
            } else {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match.");
                }
                await signup(username, password);
            }
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div
            className="w-screen h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')` }}
        >
            <div className="w-full max-w-md bg-stone-800/80 backdrop-blur-md rounded-xl shadow-2xl border-2 border-stone-700/50 overflow-hidden">
                <div className="flex">
                    <button
                        onClick={() => setIsLoginView(true)}
                        className={`w-1/2 py-4 text-xl font-bold transition-colors ${isLoginView ? 'bg-amber-600/20 text-amber-300' : 'bg-transparent text-stone-400 hover:bg-stone-700/50'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLoginView(false)}
                        className={`w-1/2 py-4 text-xl font-bold transition-colors ${!isLoginView ? 'bg-amber-600/20 text-amber-300' : 'bg-transparent text-stone-400 hover:bg-stone-700/50'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <InputField
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        iconClass="fas fa-user"
                    />

                    <InputField
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        iconClass="fas fa-lock"
                    />

                    {!isLoginView && (
                        <InputField
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            iconClass="fas fa-check-double"
                        />
                    )}

                    {error && (
                        <p className="text-red-400 text-center text-sm bg-red-900/50 p-2 rounded-md">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-md text-lg transition-colors shadow-lg disabled:bg-stone-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                           <i className="fas fa-spinner fa-spin text-2xl"></i>
                        ) : (
                            isLoginView ? 'Enter the Realm' : 'Forge Account'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
