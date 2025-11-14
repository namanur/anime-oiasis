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

// FIX: Add global type declarations for the Google Identity Services API to resolve TypeScript errors.
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any) => void; }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; type?: string; }
          ) => void;
          disableAutoSelect: () => void;
          prompt: (notification?: any) => void;
        };
      };
    };
  }
}
