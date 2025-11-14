// FIX: Replaced placeholder content with the AnimeDetail component implementation.
import React from 'react';
import type { Anime } from '../types';

interface AnimeDetailProps {
    anime: Anime | null;
    onClose: () => void;
    isWatchlisted: boolean;
    onToggleWatchlist: () => void;
}

const BookmarkIcon: React.FC<{isFilled: boolean, className?: string}> = ({ isFilled, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
);

const AnimeDetail: React.FC<AnimeDetailProps> = ({ anime, onClose, isWatchlisted, onToggleWatchlist }) => {
    
    // A simple function to sanitize description, removing html tags
    const cleanDescription = (desc: string | null) => {
        return desc?.replace(/<[^>]*>?/gm, '') || 'No description available.';
    }

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ${anime ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal Panel */}
            <div 
                className={`fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${anime ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="anime-detail-title"
            >
                {anime && (
                    <div className="h-full flex flex-col">
                        <div className="relative">
                            <img 
                                src={anime.bannerImage || anime.coverImage.extraLarge} 
                                alt={`${anime.title.romaji} banner`} 
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                            <button 
                                onClick={onClose}
                                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors"
                                aria-label="Close details"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6 flex-grow overflow-y-auto">
                            <div className="flex items-start gap-4 -mt-16">
                                <img 
                                    src={anime.coverImage.large} 
                                    alt={anime.title.romaji} 
                                    className="w-28 rounded-md shadow-lg"
                                />
                                <div className="pt-16">
                                    <h2 id="anime-detail-title" className="text-2xl font-bold text-white">
                                        {anime.title.english || anime.title.romaji}
                                    </h2>
                                    <p className="text-sm text-slate-400">{anime.title.native}</p>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex gap-2 flex-wrap">
                                    {anime.genres.slice(0, 3).map(genre => (
                                        <span key={genre} className="bg-slate-700 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                                 <button
                                    onClick={onToggleWatchlist}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-colors
                                            ${isWatchlisted 
                                                ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                                                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
                                >
                                    <BookmarkIcon isFilled={isWatchlisted} className="w-4 h-4" />
                                    {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
                                </button>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-slate-400">Score</p>
                                    <p className="text-lg font-bold text-white">{anime.averageScore ? `${anime.averageScore}/100` : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Episodes</p>
                                    <p className="text-lg font-bold text-white">{anime.episodes || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Status</p>
                                    <p className="text-lg font-bold text-white capitalize">{anime.status.toLowerCase().replace('_', ' ')}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-semibold text-white mb-2">Description</h3>
                                <p className="text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanDescription(anime.description) }}></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AnimeDetail;
