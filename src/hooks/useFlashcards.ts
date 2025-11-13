import { useState, useEffect, useCallback } from "react";
import type { FlashcardDTO, FlashcardType, UpdateFlashcardCommand } from "@/types";

export interface FlashcardsFilters {
  type?: FlashcardType;
  generation_id?: number;
  page: number;
  limit: number;
  sort_by: "created_at" | "updated_at";
  sort_order: "asc" | "desc";
}

interface UseFlashcardsReturn {
  items: FlashcardDTO[];
  loading: boolean;
  error: Error | null;
  filters: FlashcardsFilters;
  totalPages: number;
  totalWithoutFilters: number; // Dodajemy całkowitą liczbę fiszek bez filtrów
  setFilters: (f: FlashcardsFilters) => void;
  deleteFlashcard: (id: number) => Promise<void>;
  updateFlashcard: (id: number, data: UpdateFlashcardCommand) => Promise<void>;
  fetchPage: (page: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useFlashcards(): UseFlashcardsReturn {
  const [items, setItems] = useState<FlashcardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWithoutFilters, setTotalWithoutFilters] = useState(0);
  const [filters, setFilters] = useState<FlashcardsFilters>({
    page: 1,
    limit: 21,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const buildQueryString = useCallback((f: FlashcardsFilters): string => {
    const params = new URLSearchParams();
    params.append("page", f.page.toString());
    params.append("limit", f.limit.toString());
    params.append("sort_by", f.sort_by);
    params.append("sort_order", f.sort_order);

    if (f.type) {
      params.append("type", f.type);
    }
    if (f.generation_id) {
      params.append("generation_id", f.generation_id.toString());
    }

    return params.toString();
  }, []);

  const fetchFlashcards = useCallback(
    async (f: FlashcardsFilters) => {
      try {
        setLoading(true);
        setError(null);

        const queryString = buildQueryString(f);
        const response = await fetch(`/api/flashcards?${queryString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/auth/login";
            return;
          }
          throw new Error("Nie udało się pobrać fiszek");
        }

        const data = await response.json();
        setItems(data.data || []);
        setTotalPages(data.pagination?.total_pages || 1);
        setTotalWithoutFilters(data.pagination?.total_without_filters || 0);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Wystąpił nieoczekiwany błąd"));
      } finally {
        setLoading(false);
      }
    },
    [buildQueryString]
  );

  const deleteFlashcard = async (id: number): Promise<void> => {
    const response = await fetch(`/api/flashcards/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/auth/login";
        return;
      }
      if (response.status === 404) {
        throw new Error("Fiszka nie istnieje");
      }
      throw new Error("Nie udało się usunąć fiszki");
    }

    // Check if this is the last item on the current page before removing it
    const currentPage = filters.page;
    const currentPageItems = items.length;
    const isLastItemOnPage = currentPageItems === 1;
    const shouldNavigateToPreviousPage = isLastItemOnPage && currentPage > 1;

    // Optimistic update: remove item from local state immediately
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

    // If we deleted the last item on the current page and we're not on page 1,
    // navigate to the previous page
    if (shouldNavigateToPreviousPage) {
      const newPage = currentPage - 1;
      const newFilters = { ...filters, page: newPage };
      setFilters(newFilters);
      await fetchFlashcards(newFilters);
    } else {
      // Otherwise, refresh the current page
      await fetchFlashcards(filters);
    }
  };

  const updateFlashcard = async (id: number, data: UpdateFlashcardCommand): Promise<void> => {
    // Optimistic update - update local state immediately
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              front: data.front ?? item.front,
              back: data.back ?? item.back,
              updated_at: new Date().toISOString(),
            }
          : item
      )
    );

    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        await fetchFlashcards(filters);

        if (response.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
        if (response.status === 404) {
          throw new Error("Fiszka nie istnieje");
        }
        throw new Error("Nie udało się zaktualizować fiszki");
      }

      // Success - optimistic update was correct, no need to refetch
    } catch (err) {
      // Revert optimistic update on network error
      await fetchFlashcards(filters);
      throw err;
    }
  };

  const fetchPage = async (page: number): Promise<void> => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    await fetchFlashcards(newFilters);
  };

  const refetch = async (): Promise<void> => {
    await fetchFlashcards(filters);
  };

  // Only fetch on initial load
  useEffect(() => {
    fetchFlashcards(filters);
  }, [fetchFlashcards, filters]);

  // Optimized setFilters with manual fetch
  const setFiltersOptimized = useCallback(
    (newFilters: FlashcardsFilters) => {
      setFilters(newFilters);
      // Fetch with new filters immediately
      fetchFlashcards(newFilters);
    },
    [fetchFlashcards]
  );

  return {
    items,
    loading,
    error,
    filters,
    totalPages,
    totalWithoutFilters,
    setFilters: setFiltersOptimized,
    deleteFlashcard,
    updateFlashcard,
    fetchPage,
    refetch,
  };
}
