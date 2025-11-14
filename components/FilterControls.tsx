// FIX: Replaced placeholder content with the FilterControls component implementation.
import React from 'react';
import { ANIME_GENRES, ANIME_SORTS } from '../constants';

interface FilterControlsProps {
    onFilterChange: (filters: { genre?: string; sort?: string; }) => void;
    showWatchlistOnly: boolean;
    onToggleWatchlist: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onFilterChange, showWatchlistOnly, onToggleWatchlist }) => {

    const handleFilter = (key: 'genre' | 'sort', value: string) => {
        onFilterChange({ [key]: value });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between flex-wrap">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-grow w-full sm:w-auto">
                <div className="w-full sm:w-auto sm:flex-grow">
                    <label htmlFor="genre-select" className="sr-only">Genre</label>
                    <select 
                        id="genre-select"
                        onChange={(e) => handleFilter('genre', e.target.value)}
                        disabled={showWatchlistOnly}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">All Genres</option>
                        {ANIME_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="w-full sm:w-auto sm:flex-grow">
                    <label htmlFor="sort-select" className="sr-only">Sort by</label>
                    <select 
                        id="sort-select"
                        defaultValue={'POPULARITY_DESC'}
                        onChange={(e) => handleFilter('sort', e.target.value)}
                        disabled={showWatchlistOnly}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {Object.entries(ANIME_SORTS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <label htmlFor="watchlist-toggle" className="text-slate-300 font-medium cursor-pointer">
                    My Watchlist
                </label>
                <button
                    id="watchlist-toggle"
                    onClick={onToggleWatchlist}
                    role="switch"
                    aria-checked={showWatchlistOnly}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 ${showWatchlistOnly ? 'bg-cyan-500' : 'bg-slate-700'}`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showWatchlistOnly ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </button>
            </div>
        </div>
    );
};

export default FilterControls;