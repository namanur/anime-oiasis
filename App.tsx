// FIX: Replaced placeholder content with the main App component implementation.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { Anime, User } from './types';
import { fetchAnime, fetchAnimeByIds, FetchAnimeResponse } from './services/anilist';
import Header from './components/Header';
import FilterControls from './components/FilterControls';
import AnimeCard from './components/AnimeCard';
import AnimeDetail from './components/AnimeDetail';
import AnimeCardSkeleton from './components/AnimeCardSkeleton';

const GOOGLE_CLIENT_ID = '513258378640-qurfco33eeiej1r0kbhbgjs8tst9ofc0.apps.googleusercontent.com';

const App: React.FC = () => {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [sort, setSort] = useState('POPULARITY_DESC');
    const [user, setUser] = useState<User | null>(null);
    const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);

    const [watchlist, setWatchlist] = useState<number[]>(() => {
        const saved = localStorage.getItem('watchlist');
        return saved ? JSON.parse(saved) : [];
    });

    const observer = useRef<IntersectionObserver>();
    const lastAnimeElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading || showWatchlistOnly) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage, showWatchlistOnly]);

    const handleCredentialResponse = (response: any) => {
        try {
            const decoded: { name: string; picture: string; } = jwtDecode(response.credential);
            const newUser: User = { name: decoded.name, avatarUrl: decoded.picture };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        } catch (error) {
            console.error("Failed to decode JWT:", error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        if (window.google) {
            window.google.accounts.id.disableAutoSelect();
        }
    };
    
    // Google Sign-In and User Session Effect
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });
            const signInButtonContainer = document.getElementById('signInButtonContainer');
            if (signInButtonContainer) {
                 window.google.accounts.id.renderButton(signInButtonContainer, { theme: 'outline', size: 'large', type: 'standard' });
            }
        }
    }, []);

    const loadAnime = useCallback(async (reset = false) => {
        if (showWatchlistOnly) return;
        setIsLoading(true);
        const currentPage = reset ? 1 : page;
        const response: FetchAnimeResponse = await fetchAnime({ page: currentPage, search, genre, sort });
        
        setAnimeList(prev => {
            const newList = reset ? response.anime : [...prev, ...response.anime];
            // Prevent duplicates
            return newList.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        });
        setHasNextPage(response.hasNextPage);
        if (reset) {
            setPage(1);
        }
        
        setIsLoading(false);
    }, [page, search, genre, sort, showWatchlistOnly]);

    const loadWatchlist = useCallback(async () => {
        if (watchlist.length === 0) {
            setAnimeList([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const response = await fetchAnimeByIds(watchlist);
        setAnimeList(response.anime);
        setHasNextPage(false); 
        setIsLoading(false);
    }, [watchlist]);

    // Effect for initial load, filter changes, and watchlist toggle
    useEffect(() => {
        const handler = setTimeout(() => {
            if (showWatchlistOnly) {
                loadWatchlist();
            } else {
                loadAnime(true);
            }
        }, 300); // Debounce
        return () => clearTimeout(handler);
    }, [search, genre, sort, showWatchlistOnly, loadWatchlist]); 

    // Effect for infinite scroll
    useEffect(() => {
        if (page > 1 && !showWatchlistOnly) {
            loadAnime();
        }
    }, [page, showWatchlistOnly]);
    
    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    const handleSelectAnime = (anime: Anime) => setSelectedAnime(anime);
    const handleCloseDetail = () => setSelectedAnime(null);

    const handleToggleWatchlist = (animeId: number) => {
        setWatchlist(prev => 
            prev.includes(animeId) 
                ? prev.filter(id => id !== animeId) 
                : [...prev, animeId]
        );
    };
    
    const handleFilterChange = (filters: { search?: string; genre?: string; sort?: string; }) => {
        setShowWatchlistOnly(false); // Turn off watchlist view when new filters are applied
        if (filters.search !== undefined && filters.search !== search) setSearch(filters.search);
        if (filters.genre !== undefined && filters.genre !== genre) setGenre(filters.genre);
        if (filters.sort !== undefined && filters.sort !== sort) setSort(filters.sort);
    };

    const handleToggleWatchlistFilter = () => {
        setAnimeList([]);
        setShowWatchlistOnly(prev => !prev);
    };

    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen font-sans">
            <Header onSearch={(s) => handleFilterChange({ search: s })} user={user} onLogout={handleLogout} />
            
            <main className="container mx-auto px-4 py-8">
                <FilterControls 
                    onFilterChange={handleFilterChange} 
                    showWatchlistOnly={showWatchlistOnly} 
                    onToggleWatchlist={handleToggleWatchlistFilter}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mt-8">
                    {isLoading && animeList.length === 0 && Array.from({ length: 12 }).map((_, i) => <AnimeCardSkeleton key={`skeleton-${i}`} />)}
                    
                    {animeList.map((anime, index) => {
                        const isLastElement = animeList.length === index + 1;
                        return (
                            <div ref={isLastElement ? lastAnimeElementRef : null} key={`${anime.id}-${index}`}>
                                <AnimeCard 
                                    anime={anime} 
                                    onSelect={handleSelectAnime}
                                    isWatchlisted={watchlist.includes(anime.id)}
                                    onToggleWatchlist={handleToggleWatchlist}
                                />
                            </div>
                        );
                    })}
                    {isLoading && animeList.length > 0 && Array.from({ length: 6 }).map((_, i) => <AnimeCardSkeleton key={`skeleton-loadmore-${i}`} />)}
                </div>
                {!isLoading && !hasNextPage && !showWatchlistOnly && animeList.length > 0 && (
                     <p className="text-center text-slate-500 mt-8">You've reached the end!</p>
                )}
                 {!isLoading && animeList.length === 0 && (
                     <p className="text-center text-slate-400 mt-12 text-xl">
                        {showWatchlistOnly ? "Your watchlist is empty." : "No anime found. Try a different filter?"}
                     </p>
                )}
            </main>
            
            <AnimeDetail 
                anime={selectedAnime} 
                onClose={handleCloseDetail}
                isWatchlisted={selectedAnime ? watchlist.includes(selectedAnime.id) : false}
                onToggleWatchlist={selectedAnime ? () => handleToggleWatchlist(selectedAnime.id) : () => {}}
            />
        </div>
    );
};

export default App;