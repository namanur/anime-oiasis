import type { Anime } from '../types';

const ANILIST_API_URL = 'https://graphql.anilist.co';

const ANIME_FIELDS_FRAGMENT = `
  fragment AnimeFields on Media {
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
`;

const SEARCH_ANIME_QUERY = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
      }
      media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
        ...AnimeFields
      }
    }
  }
  ${ANIME_FIELDS_FRAGMENT}
`;

const TRENDING_ANIME_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
      }
      media(sort: TRENDING_DESC, type: ANIME) {
        ...AnimeFields
      }
    }
  }
  ${ANIME_FIELDS_FRAGMENT}
`;

const GENRE_COLLECTION_QUERY = `
  query {
    GenreCollection
  }
`;

interface AniListPageInfo {
  hasNextPage: boolean;
}

interface AniListPage<T> {
  media: T[];
  pageInfo: AniListPageInfo;
}


async function fetchAniListData<T>(query: string, variables: Record<string, any>): Promise<T> {
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
    throw new Error(`AniList API request failed with status ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
    console.error('AniList API Errors:', json.errors);
    throw new Error(`GraphQL error: ${json.errors.map((e: any) => e.message).join(', ')}`);
  }

  return json.data;
}

const PER_PAGE = 50;

export const searchAnime = async (search: string, page = 1, perPage = PER_PAGE): Promise<{ media: Anime[], hasNextPage: boolean }> => {
  const data = await fetchAniListData<{ Page: AniListPage<Anime> }>(SEARCH_ANIME_QUERY, {
    search,
    page,
    perPage,
  });
  return { media: data.Page.media, hasNextPage: data.Page.pageInfo.hasNextPage };
};

export const getTrendingAnime = async (page = 1, perPage = PER_PAGE): Promise<{ media: Anime[], hasNextPage: boolean }> => {
  const data = await fetchAniListData<{ Page: AniListPage<Anime> }>(TRENDING_ANIME_QUERY, {
    page,
    perPage,
  });
  return { media: data.Page.media, hasNextPage: data.Page.pageInfo.hasNextPage };
};

export const getGenres = async (): Promise<string[]> => {
    const data = await fetchAniListData<{ GenreCollection: string[] }>(GENRE_COLLECTION_QUERY, {});
    return data.GenreCollection;
};
