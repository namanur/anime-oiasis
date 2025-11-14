import React from 'react';
import type { Anime } from '../types';

interface AnimeCardProps {
    anime: Anime;
    onSelect: (anime: Anime) => void;
    isWatchlisted: boolean;
    onToggleWatchlist: (animeId: number) => void;
}

const BookmarkIcon: React.FC<{isFilled: boolean, className?: string}> = ({ isFilled, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
);


const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelect, isWatchlisted, onToggleWatchlist }) => {
    
    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening the detail view
        onToggleWatchlist(anime.id);
    };

    return (
        <div 
            className="group relative rounded-lg overflow-hidden shadow-lg bg-slate-800 hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div
                className="w-full h-full absolute inset-0 z-10 cursor-pointer"
                onClick={() => onSelect(anime)}
                aria-label={`View details for ${anime.title.english || anime.title.romaji}`}
            />

            <button
                onClick={handleBookmarkClick}
                className={`absolute top-2 left-2 z-20 p-1.5 rounded-full transition-all duration-200 
                           ${isWatchlisted 
                                ? 'bg-cyan-500/80 text-white' 
                                : 'bg-black/50 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/70'
                           } scale-90 group-hover:scale-100`}
                aria-label={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
            >
                <BookmarkIcon isFilled={isWatchlisted} className="w-5 h-5" />
            </button>
            
            <div className="relative w-full aspect-[2/3] overflow-hidden">
                <img 
                    src={anime.coverImage.extraLarge || anime.coverImage.large} 
                    alt={anime.title.romaji}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white text-sm font-bold truncate" title={anime.title.english || anime.title.romaji}>
                        {anime.title.english || anime.title.romaji}
                    </h3>
                </div>
                {anime.averageScore && (
                     <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {anime.averageScore / 10}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnimeCard;