import React from 'react';
import type { Anime } from '../types';

interface AnimeDetailProps {
    anime: Anime;
    onClose: () => void;
}

const XIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const AnimeDetail: React.FC<AnimeDetailProps> = ({ anime, onClose }) => {
    // Sanitize description to prevent HTML injection if it were ever enabled in anilist.ts
    const sanitizedDescription = anime.description?.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
    
    const watchUrl = `https://hianime.bz/search?keyword=${encodeURIComponent(anime.title.romaji)}`;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out forwards;
                    }
                    @keyframes slide-up {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .animate-slide-up {
                         animation: slide-up 0.4s ease-out forwards;
                    }
                `}
            </style>
            <div 
                className="relative bg-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col sm:flex-row animate-slide-up"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10 p-2 bg-black/30 rounded-full"
                    aria-label="Close"
                >
                    <XIcon className="w-6 h-6" />
                </button>
                
                <div className="w-full sm:w-1/3 flex-shrink-0">
                     <img 
                        src={anime.coverImage.extraLarge || anime.coverImage.large} 
                        alt={anime.title.romaji}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="w-full sm:w-2/3 p-6 sm:p-8 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 pr-12">
                        {anime.title.english || anime.title.romaji}
                    </h2>
                    {anime.title.english && anime.title.english !== anime.title.romaji && <p className="text-slate-400 text-sm mt-1">{anime.title.romaji}</p>}
                    
                    <div className="flex flex-wrap gap-2 my-4">
                        {anime.genres.map(genre => (
                            <span key={genre} className="px-3 py-1 bg-slate-700 text-cyan-300 text-xs font-semibold rounded-full">
                                {genre}
                            </span>
                        ))}
                    </div>

                    <div className="text-slate-300 my-4 whitespace-pre-wrap max-h-48 overflow-y-auto pr-2">
                        {sanitizedDescription}
                    </div>

                    <div className="mt-6 border-t border-slate-700 pt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-slate-400">Average Score</p>
                            <p className="text-lg font-bold text-cyan-400">{anime.averageScore ? `${anime.averageScore}%` : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-400">Episodes</p>
                            <p className="text-lg font-bold">{anime.episodes || 'N/A'}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-slate-400">Status</p>
                            <p className="text-lg font-bold capitalize">{anime.status ? anime.status.replace(/_/g, ' ').toLowerCase() : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-400">MyAnimeList ID</p>
                            <p className="text-lg font-bold">{anime.idMal ? <a href={`https://myanimelist.net/anime/${anime.idMal}`} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">{anime.idMal}</a> : 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <a 
                            href={watchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full text-center py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
                        >
                            Watch on HiAnime.bz
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetail;