import React from 'react';

interface FilterControlsProps {
    genres: string[];
    searchTerm: string;
    selectedGenre: string;
    onSearchChange: (term: string) => void;
    onGenreChange: (genre: string) => void;
    onClearFilters: () => void;
    showWatchlistOnly: boolean;
    onToggleWatchlistFilter: () => void;
}

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const FilterControls: React.FC<FilterControlsProps> = ({
    genres,
    searchTerm,
    selectedGenre,
    onSearchChange,
    onGenreChange,
    onClearFilters,
    showWatchlistOnly,
    onToggleWatchlistFilter,
}) => {
    return (
        <div className="w-full max-w-5xl p-4 bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    disabled={showWatchlistOnly}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
            <div className="relative w-full sm:flex-1">
                <select
                    value={selectedGenre}
                    onChange={(e) => onGenreChange(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white appearance-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                >
                    {genres.map(genre => (
                        <option key={genre} value={genre} className="bg-slate-800">{genre}</option>
                    ))}
                </select>
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleWatchlistFilter}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${showWatchlistOnly ? 'bg-cyan-500' : 'bg-slate-700'}`}
                >
                    <span className="sr-only">Show Watchlist</span>
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showWatchlistOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm font-medium whitespace-nowrap">My Watchlist</span>
            </div>
            <button
              onClick={onClearFilters}
              className="px-4 py-2 bg-pink-600/50 hover:bg-pink-600/80 text-white rounded-lg border border-pink-500/50 transition-colors duration-200 whitespace-nowrap"
            >
              Clear
            </button>
        </div>
    );
};

export default FilterControls;