import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    isLoggedIn: boolean;
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, onLogout }) => {
    return (
        <header className="w-full max-w-7xl mb-8 flex justify-between items-center flex-wrap gap-4">
            <div className="text-left">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 py-2">
                    Anime Oasis
                </h1>
                <p className="mt-1 text-slate-300 text-lg">Your portal to animated worlds</p>
            </div>
            
            <div className="flex items-center">
                {isLoggedIn && user ? (
                    <div className="flex items-center gap-4 bg-black/20 backdrop-blur-lg border border-white/10 p-2 rounded-full">
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-cyan-400" />
                        <span className="text-white font-medium hidden sm:block">{user.name}</span>
                        <button 
                            onClick={onLogout} 
                            className="px-4 py-2 bg-pink-600/50 hover:bg-pink-600/80 text-white rounded-full border border-pink-500/50 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                   <div id="google-signin-button"></div>
                )}
            </div>
        </header>
    );
};

export default Header;