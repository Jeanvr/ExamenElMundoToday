export interface Post {
    id: number;
    title: { rendered: string };
    featured_media: number;
    link: string;
    imageUrl?: string;
  }
  