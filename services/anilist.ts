import type { Anime } from '../types';

const ANILIST_API_URL = 'https://graphql.anilist.co';

const ANIME_QUERY_FIELDS = `
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
`;

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
        ${ANIME_QUERY_FIELDS}
      }
    }
  }
`;

const ANIME_BY_IDS_QUERY = `
  query ($ids: [Int], $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
      }
      media(id_in: $ids, type: ANIME) {
        ${ANIME_QUERY_FIELDS}
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

const fetchFromAniList = async (query: string, variables: any): Promise<any> => {
    const response = await fetch(ANILIST_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
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
    return json.data.Page;
};


export const fetchAnime = async (options: FetchAnimeOptions): Promise<FetchAnimeResponse> => {
    const { page = 1, perPage = 20, search, genre, sort = 'POPULARITY_DESC' } = options;
    
    const variables: any = { page, perPage, sort: [sort] };
    if (search) variables.search = search;
    if (genre) variables.genre = genre;

    try {
        const data = await fetchFromAniList(ANIME_QUERY, variables);
        return {
            anime: data.media.filter((item: any) => item !== null),
            hasNextPage: data.pageInfo.hasNextPage,
        };
    } catch (error) {
        console.error('Error fetching anime data:', error);
        return { anime: [], hasNextPage: false };
    }
};

export const fetchAnimeByIds = async (ids: number[]): Promise<FetchAnimeResponse> => {
    if (ids.length === 0) {
        return { anime: [], hasNextPage: false };
    }
    
    // AniList API is paginated, max 50 per page. We fetch up to 50 for the watchlist.
    const variables = { ids, page: 1, perPage: 50 };

    try {
        const data = await fetchFromAniList(ANIME_BY_IDS_QUERY, variables);
        return {
            anime: data.media.filter((item: any) => item !== null),
            hasNextPage: data.pageInfo.hasNextPage,
        };
    } catch (error) {
        console.error('Error fetching watchlist anime data:', error);
        return { anime: [], hasNextPage: false };
    }
};