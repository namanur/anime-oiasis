// FIX: Replaced placeholder content with the Header component implementation.
import React, from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { User } from '../types';

interface HeaderProps {
    onSearch: (searchTerm: string) => void;
    user: User | null;
    onLogout: () => void;
}

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onSearch, user, onLogout }) => {
    const { theme, toggleTheme } = useTheme();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    };

    return (
        <header className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
                <h1 className="text-xl md:text-2xl font-bold text-cyan-400 shrink-0">
                    Anime<span className="text-slate-100">Oasis</span>
                </h1>

                <div className="relative flex-grow max-w-sm hidden sm:block">
                    <input 
                        type="text"
                        placeholder="Search for an anime..."
                        onChange={handleSearchChange}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-full py-2 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleTheme} 
                        className="p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full border-2 border-slate-600" />
                            <button 
                                onClick={onLogout}
                                className="hidden md:block bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold px-4 py-2 rounded-md transition-colors text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div id="signInButtonContainer" className="w-[180px]"></div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;