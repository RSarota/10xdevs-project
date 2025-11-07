import { useState } from "react";
import type { CreateFlashcardCommand } from "@/types";

export interface AddFlashcardFormData {
  front: string;
  back: string;
}

interface UseAddFlashcardReturn {
  loading: boolean;
  submit: (data: AddFlashcardFormData) => Promise<void>;
}

export function useAddFlashcard(): UseAddFlashcardReturn {
  const [loading, setLoading] = useState(false);

  const submit = async (data: AddFlashcardFormData): Promise<void> => {
    setLoading(true);

    try {
      const command: CreateFlashcardCommand = {
        front: data.front.trim(),
        back: data.back.trim(),
        source: "manual",
        generation_id: undefined,
      };

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flashcards: [command] }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/auth/login";
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.message || "Nie udało się dodać fiszki");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submit,
  };
}
