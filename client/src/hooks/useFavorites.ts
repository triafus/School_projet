import { useState, useCallback } from "react";

export const useFavorites = (initialFavorites: Set<number> = new Set()) => {
  const [favorites, setFavorites] = useState<Set<number>>(initialFavorites);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.has(id),
    [favorites]
  );

  const addFavorite = useCallback((id: number) => {
    setFavorites((prev) => new Set(prev).add(id));
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.delete(id);
      return newFavorites;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
  };
};
