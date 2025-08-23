export interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: number;
  category: string;
  image: string;
  color: string;
}

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Abstract Fusion",
    artist: "Marie Dubois",
    year: 2024,
    category: "Abstrait",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
    color: "#FF6B6B",
  },
  {
    id: 2,
    title: "Urban Landscape",
    artist: "Jean Martin",
    year: 2023,
    category: "Paysage",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop",
    color: "#4ECDC4",
  },
  {
    id: 3,
    title: "Digital Dreams",
    artist: "Sophie Laurent",
    year: 2024,
    category: "Digital",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=500&fit=crop",
    color: "#45B7D1",
  },
  {
    id: 4,
    title: "Nature's Symphony",
    artist: "Paul Monet",
    year: 2023,
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=500&fit=crop",
    color: "#96CEB4",
  },
  {
    id: 5,
    title: "Geometric Harmony",
    artist: "Elena Vasquez",
    year: 2024,
    category: "Géométrique",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&fit=crop",
    color: "#FECA57",
  },
  {
    id: 6,
    title: "Emotional Flow",
    artist: "Alex Chen",
    year: 2023,
    category: "Expressionnisme",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=450&fit=crop",
    color: "#FF9FF3",
  },
];

export const GALLERY_STATS = [
  { value: "1.2K", label: "Œuvres", color: "#E74C3C" },
  { value: "350", label: "Artistes", color: "#4ECDC4" },
  { value: "15K", label: "Visiteurs", color: "#45B7D1" },
] as const;
