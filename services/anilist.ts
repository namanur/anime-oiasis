import type { Anime } from '../types';

const ANILIST_API_URL = 'https://graphql.anilist.co';

const ANIME_QUERY = `
  query (
    $page: Int, 
    $perPage: Int, 
    $search: String, 
    $genre: String, 
    $sort: [MediaSort]
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(
        type: ANIME, 
        search: $search, 
        genre: $genre, 
        sort: $sort, 
        isAdult: false
      ) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        description(asHtml: false)
        genres
        coverImage {
          extraLarge
          large
          medium
        }
        bannerImage
        averageScore
        episodes
        status
      }
    }
  }
`;

interface FetchAnimeOptions {
    page?: number;
    perPage?: number;
    search?: string;
    genre?: string;
    sort?: string;
}

export interface FetchAnimeResponse {
    anime: Anime[];
    hasNextPage: boolean;
}

export const fetchAnime = async (options: FetchAnimeOptions): Promise<FetchAnimeResponse> => {
    const { page = 1, perPage = 20, search, genre, sort = 'POPULARITY_DESC' } = options;
    
    const variables: any = {
        page,
        perPage,
        sort: [sort],
    };

    if (search) {
        variables.search = search;
    }
    if (genre) {
        variables.genre = genre;
    }

    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: ANIME_QUERY,
                variables: variables,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        
        if (json.errors) {
            console.error('GraphQL errors:', json.errors);
            throw new Error('Failed to fetch data from AniList');
        }

        const data = json.data.Page;
        return {
            anime: data.media.filter((item: any) => item !== null), // Filter out any null items
            hasNextPage: data.pageInfo.hasNextPage,
        };
    } catch (error) {
        console.error('Error fetching anime data:', error);
        return { anime: [], hasNextPage: false };
    }
};
