import React from 'react';

const GENRES = [
    "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror",
    "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance",
    "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
];

const SORT_OPTIONS = {
    'POPULARITY_DESC': 'Popularity',
    'SCORE_DESC': 'Score',
    'TRENDING_DESC': 'Trending',
    'START_DATE_DESC': 'Newest',
    'TITLE_ROMAJI': 'Alphabetical',
};

interface FilterControlsProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    sortOption,
    setSortOption,
}) => {
    return (
        <div className="w-full max-w-7xl mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            {/* Search Input */}
            <div className="flex flex-col">
                <label htmlFor="search" className="text-sm font-medium text-slate-400 mb-1">Search Anime</label>
                <input
                    id="search"
                    type="text"
                    placeholder="e.g., Attack on Titan"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                />
            </div>

            {/* Genre Select */}
            <div className="flex flex-col">
                <label htmlFor="genre" className="text-sm font-medium text-slate-400 mb-1">Genre</label>
                <select
                    id="genre"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition appearance-none bg-no-repeat bg-right pr-8"
                     style={{
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
                        backgroundPosition: 'right 0.5rem center'
                    }}
                >
                    <option value="">All Genres</option>
                    {GENRES.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sort Select */}
            <div className="flex flex-col">
                 <label htmlFor="sort" className="text-sm font-medium text-slate-400 mb-1">Sort By</label>
                <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition appearance-none bg-no-repeat bg-right pr-8"
                     style={{
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
                        backgroundPosition: 'right 0.5rem center'
                    }}
                >
                    {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FilterControls;
