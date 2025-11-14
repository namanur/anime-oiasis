import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getTrendingAnime, searchAnime, getGenres } from './services/anilist';
import type { Anime, User } from './types';
import Header from './components/Header';
import FilterControls from './components/FilterControls';
import AnimeCard from './components/AnimeCard';
import AnimeDetail from './components/AnimeDetail';
import AnimeCardSkeleton from './components/AnimeCardSkeleton';

// IMPORTANT: Replace with your own Google Client ID
const GOOGLE_CLIENT_ID = "513258378640-qurfco33eeiej1r0kbhbgjs8tst9ofc0.apps.googleusercontent.com";

const App: React.FC = () => {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [genres, setGenres] = useState<string[]>(['All Genres']);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All Genres');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    
    // For user state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Watchlist state
    const [watchlist, setWatchlist] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem('animeWatchlist');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to parse watchlist from localStorage", error);
            return [];
        }
    });
    const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);

    const observer = useRef<IntersectionObserver>();
    const lastAnimeElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading || showWatchlistOnly) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage, showWatchlistOnly]);

    // Persist watchlist to localStorage
    useEffect(() => {
        localStorage.setItem('animeWatchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    const handleCredentialResponse = (response: any) => {
        // Decode the JWT to get user info
        const decoded: { name: string; picture: string; email: string } = JSON.parse(atob(response.credential.split('.')[1]));
        
        setUser({
            name: decoded.name,
            avatarUrl: decoded.picture,
        });
        setIsLoggedIn(true);
    };
    
    // Google OAuth Integration
    useEffect(() => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse
            });
            
            const googleButton = document.getElementById('google-signin-button');
            if (googleButton) {
                window.google.accounts.id.renderButton(
                    googleButton,
                    { theme: "outline", size: "large", type: "standard" } 
                );
            }

            // Optional: Prompt for one-tap sign-in on subsequent visits
            // window.google.accounts.id.prompt();
        } else {
            console.error("Google Identity Services script not loaded.");
        }
    }, []);


    const handleLogout = () => {
        if (window.google) {
           window.google.accounts.id.disableAutoSelect();
        }
        setIsLoggedIn(false);
        setUser(null);
    };


    const toggleWatchlist = (animeId: number) => {
        setWatchlist(prev => 
            prev.includes(animeId) 
                ? prev.filter(id => id !== animeId) 
                : [...prev, animeId]
        );
    };

    const isWatchlisted = (animeId: number) => watchlist.includes(animeId);

    const fetchAnimes = useCallback(async (page: number, term: string, reset: boolean) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = term
                ? await searchAnime(term, page)
                : await getTrendingAnime(page);

            setAnimes(prev => {
                const newAnimes = res.media;
                if (reset) return newAnimes;
                
                // Prevent duplicates
                const existingIds = new Set(prev.map(a => a.id));
                const uniqueNewAnimes = newAnimes.filter(a => !existingIds.has(a.id));
                return [...prev, ...uniqueNewAnimes];
            });
            setHasNextPage(res.hasNextPage);
        } catch (err) {
            setError('Failed to fetch anime data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch genres on mount
    useEffect(() => {
        getGenres()
            .then(genreData => setGenres(['All Genres', ...genreData]))
            .catch(err => console.error("Failed to fetch genres:", err));
    }, []);

    // Handle fetching data on search term change (debounced) or page change
    useEffect(() => {
        if (showWatchlistOnly) return; // Don't fetch when viewing watchlist

        const isNewSearch = currentPage === 1;
        const handler = setTimeout(() => {
            fetchAnimes(currentPage, searchTerm, isNewSearch);
        }, isNewSearch ? 500 : 0); // Debounce new searches, but load next pages instantly
        
        return () => clearTimeout(handler);
    }, [searchTerm, currentPage, fetchAnimes, showWatchlistOnly]);


    const handleSearchChange = (term: string) => {
        if (term !== searchTerm) {
            setAnimes([]); // Immediately clear results for better UX
            setCurrentPage(1);
            setSearchTerm(term);
        }
    };

    const handleGenreChange = (genre: string) => {
        setSelectedGenre(genre);
    };

    const handleClearFilters = () => {
        if (searchTerm !== '' || selectedGenre !== 'All Genres' || showWatchlistOnly) {
            setAnimes([]);
            setCurrentPage(1);
            setSearchTerm('');
            setSelectedGenre('All Genres');
            setShowWatchlistOnly(false);
        }
    };

    const getFilteredAnimes = () => {
        let animeSource = animes;
        if (showWatchlistOnly) {
            const watchlistSet = new Set(watchlist);
            animeSource = animes.filter(anime => watchlistSet.has(anime.id));
        }

        return animeSource.filter(anime =>
            selectedGenre === 'All Genres' || anime.genres.includes(selectedGenre)
        );
    }
    
    const filteredAnimes = getFilteredAnimes();

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-8">
            <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
            <main className="w-full max-w-7xl flex flex-col items-center">
                <FilterControls 
                    genres={genres}
                    searchTerm={searchTerm}
                    selectedGenre={selectedGenre}
                    onSearchChange={handleSearchChange}
                    onGenreChange={handleGenreChange}
                    onClearFilters={handleClearFilters}
                    showWatchlistOnly={showWatchlistOnly}
                    onToggleWatchlistFilter={() => setShowWatchlistOnly(!showWatchlistOnly)}
                />

                {isLoading && animes.length === 0 && (
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full">
                        {Array.from({ length: 18 }).map((_, i) => <AnimeCardSkeleton key={i} />)}
                    </div>
                )}
                {error && <p className="mt-8 text-lg text-red-400">{error}</p>}

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full">
                    {filteredAnimes.map((anime, index) => {
                        const isLastElement = filteredAnimes.length === index + 1;
                        return (
                           <div ref={isLastElement ? lastAnimeElementRef : null} key={`${anime.id}-${index}`}>
                             <AnimeCard 
                                anime={anime} 
                                onSelect={() => setSelectedAnime(anime)}
                                isWatchlisted={isWatchlisted(anime.id)}
                                onToggleWatchlist={toggleWatchlist}
                             />
                           </div>
                        );
                    })}
                </div>

                {isLoading && animes.length > 0 && <p className="mt-8 text-lg animate-pulse">Loading more...</p>}

                {!isLoading && !showWatchlistOnly && animes.length > 0 && filteredAnimes.length === 0 && (
                    <p className="mt-8 text-lg text-slate-400">No anime match the selected genre in the current results.</p>
                )}
                
                {showWatchlistOnly && filteredAnimes.length === 0 && (
                    <p className="mt-8 text-lg text-slate-400">Your watchlist is empty or no items match the genre filter.</p>
                )}


                {!isLoading && animes.length === 0 && !error && (
                    <p className="mt-8 text-lg text-slate-400">No results found. Try a different search term!</p>
                )}

                {selectedAnime && (
                    <AnimeDetail 
                        anime={selectedAnime} 
                        onClose={() => setSelectedAnime(null)} 
                    />
                )}
            </main>
        </div>
    );
};
export default App;