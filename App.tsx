import React, { useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

import Header from './components/Header';
import FilterControls from './components/FilterControls';
import AnimeCard from './components/AnimeCard';
import AnimeDetail from './components/AnimeDetail';
import AnimeCardSkeleton from './components/AnimeCardSkeleton';

import { fetchAnime } from './services/anilist';
import type { Anime, User } from './types';

const App: React.FC = () => {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

    // Filter and pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('POPULARITY_DESC');

    // User and watchlist state
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [watchlist, setWatchlist] = useState<number[]>([]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastAnimeElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage]);

    // Load watchlist from local storage on initial render
    useEffect(() => {
        try {
            const storedWatchlist = localStorage.getItem('anime-watchlist');
            if (storedWatchlist) {
                setWatchlist(JSON.parse(storedWatchlist));
            }
        } catch (e) {
            console.error("Failed to parse watchlist from localStorage", e);
        }
    }, []);

    // Save watchlist to local storage when it changes
    useEffect(() => {
        localStorage.setItem('anime-watchlist', JSON.stringify(watchlist));
    }, [watchlist]);
    
    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Effect for initial load and filter/sort changes
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchAnime({
                    page: 1,
                    perPage: 20,
                    search: debouncedSearchTerm,
                    genre: selectedGenre || undefined,
                    sort: sortOption,
                });
                setAnimeList(response.anime);
                setHasNextPage(response.hasNextPage);
                setCurrentPage(1); // Explicitly set to 1
            } catch (err) {
                setError('Failed to fetch anime. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [debouncedSearchTerm, selectedGenre, sortOption]);

    // Effect for subsequent page loads (infinite scroll)
    useEffect(() => {
        if (currentPage === 1) return;

        const loadMoreData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchAnime({
                    page: currentPage,
                    perPage: 20,
                    search: debouncedSearchTerm,
                    genre: selectedGenre || undefined,
                    sort: sortOption,
                });

                setAnimeList(prevList => {
                    const existingIds = new Set(prevList.map(a => a.id));
                    const newAnime = response.anime.filter(a => !existingIds.has(a.id));
                    return [...prevList, ...newAnime];
                });
                setHasNextPage(response.hasNextPage);
            } catch (err) {
                setError('Failed to fetch anime. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadMoreData();
    }, [currentPage, debouncedSearchTerm, selectedGenre, sortOption]);
    
    // Google Sign-In
    const handleCredentialResponse = useCallback((response: any) => {
        try {
            const decoded: { name: string, picture: string, sub: string } = jwtDecode(response.credential);
            const loggedInUser: User = {
                name: decoded.name,
                avatarUrl: decoded.picture,
            };
            setUser(loggedInUser);
            setIsLoggedIn(true);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
        } catch (error) {
            console.error("Error decoding JWT", error);
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
        if (window.google?.accounts.id) {
           window.google.accounts.id.disableAutoSelect();
        }
    };

    useEffect(() => {
        // Check for existing user in local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('user');
            }
        }

        // Initialize Google Sign-In
        if (window.google?.accounts.id) {
            window.google.accounts.id.initialize({
                // FIXME: Replace with your actual Google Client ID
                client_id: '513258378640-qurfco33eeiej1r0kbhbgjs8tst9ofc0.apps.googleusercontent.com', 
                callback: handleCredentialResponse
            });
            const GSIButton = document.getElementById('google-signin-button');
            if (GSIButton && !GSIButton.hasChildNodes()) {
                window.google.accounts.id.renderButton(
                    GSIButton,
                    { theme: "outline", size: "large", type: "standard" }
                );
            }
            if(!storedUser){
                window.google.accounts.id.prompt();
            }
        } else {
            console.error("Google Identity Services library not loaded.");
        }
    }, [handleCredentialResponse]);

    const handleToggleWatchlist = (animeId: number) => {
        setWatchlist(prev => 
            prev.includes(animeId) 
                ? prev.filter(id => id !== animeId)
                : [...prev, animeId]
        );
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans">
            <main className="container mx-auto px-4 py-8 flex flex-col items-center">
                <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

                <FilterControls 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedGenre={selectedGenre}
                    setSelectedGenre={setSelectedGenre}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                />
                
                <div className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {animeList.map((anime, index) => {
                        const cardProps = {
                            key: `${anime.id}-${index}`,
                            anime,
                            onSelect: setSelectedAnime,
                            isWatchlisted: watchlist.includes(anime.id),
                            onToggleWatchlist: handleToggleWatchlist
                        };
                        if (animeList.length === index + 1) {
                            return <div ref={lastAnimeElementRef}><AnimeCard {...cardProps} /></div>;
                        }
                        return <AnimeCard {...cardProps} />;
                    })}
                    {isLoading && Array.from({ length: 10 }).map((_, i) => <AnimeCardSkeleton key={`skeleton-${i}`} />)}
                </div>

                {!isLoading && animeList.length === 0 && (
                     <div className="w-full text-center py-16">
                        <p className="text-slate-400 text-xl">No results found.</p>
                        <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                    </div>
                )}
                
                {error && <p className="text-red-500 text-center mt-8">{error}</p>}

                {selectedAnime && (
                    <AnimeDetail anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
                )}
            </main>
        </div>
    );
};

export default App;