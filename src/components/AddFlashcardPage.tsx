import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAddFlashcard } from "@/hooks/useAddFlashcard";
import { AddFlashcardForm } from "./add-flashcard/AddFlashcardForm";
import { CheckCircle2, BookOpen } from "lucide-react";

// Apple HIG Components
import { Stack, Banner, Container, EmptyState } from "./apple-hig";

export default function AddFlashcardPage() {
  const { loading, submit } = useAddFlashcard();
  const [saved, setSaved] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (data: { front: string; back: string }) => {
    try {
      await submit(data);
      setSaved(true);
      setFormKey((prev) => prev + 1); // Reset form by changing key
      toast.success("Fiszka została dodana!", {
        description: "Możesz ją znaleźć w sekcji 'Moje fiszki'",
      });

      // Reset saved state after 5 seconds
      setTimeout(() => setSaved(false), 5000);
    } catch (err) {
      toast.error("Nie udało się dodać fiszki", {
        description: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--apple-grouped-bg))]">
      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto">
        <Container size="lg" className="py-[var(--apple-space-8)]">
          <Stack direction="vertical" spacing="lg">
            {/* Success Banner */}
            {saved && (
              <Banner
                open={saved}
                message="Fiszka została pomyślnie dodana do Twojej kolekcji!"
                type="success"
                icon={<CheckCircle2 className="w-5 h-5" />}
                action={{
                  label: "Zobacz moje fiszki",
                  onClick: () => (window.location.href = "/my-flashcards"),
                }}
              />
            )}

            {/* Form */}
            <AddFlashcardForm key={formKey} onSubmit={handleSubmit} loading={loading} />

            {/* Help section */}
            <EmptyState
              icon={<BookOpen className="w-12 h-12" />}
              title="Wskazówka"
              description="Twórz fiszki z krótkimi pytaniami i zwięzłymi odpowiedziami. To pomoże Ci szybciej się uczyć!"
            />
          </Stack>
        </Container>
      </div>
    </div>
  );
}
