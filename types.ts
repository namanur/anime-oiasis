export interface AniListTitle {
  romaji: string;
  english: string | null;
  native: string;
}

export interface AniListCoverImage {
  extraLarge: string;
  large: string;
  medium: string;
}

export interface Anime {
  id: number;
  idMal: number | null;
  title: AniListTitle;
  description: string;
  genres: string[];
  coverImage: AniListCoverImage;
  bannerImage: string | null;
  averageScore: number;
  episodes: number | null;
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
}

export interface User {
  name: string;
  avatarUrl: string;
}
