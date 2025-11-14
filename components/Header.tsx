import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    isLoggedIn: boolean;
    user: User | null;
    onLogin: () => void;
    onLogout: () => void;
}

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.303-8.591l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.244 44 30.028 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, onLogin, onLogout }) => {
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
                    <button 
                        onClick={onLogin} 
                        className="flex items-center justify-center px-6 py-3 bg-slate-50/90 hover:bg-white text-slate-800 font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        <GoogleIcon />
                        Login with Google
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;