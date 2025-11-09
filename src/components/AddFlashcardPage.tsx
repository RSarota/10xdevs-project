import { useState } from "react";
import { toast } from "sonner";
import { useAddFlashcard } from "@/hooks/useAddFlashcard";
import { AddFlashcardForm } from "./add-flashcard/AddFlashcardForm";
import { BookOpen } from "lucide-react";

// Apple HIG Components
import { Stack, Container, EmptyState, Title2, Body } from "./apple-hig";

export default function AddFlashcardPage() {
  const { loading, submit } = useAddFlashcard();
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (data: { front: string; back: string }) => {
    try {
      await submit(data);
      setFormKey((prev) => prev + 1); // Reset form by changing key
      toast.success("Fiszka została dodana!", {
        description: "Możesz ją znaleźć w sekcji 'Moje fiszki'",
      });
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
        <Container size="xl" className="py-[var(--apple-space-8)]">
          <Stack direction="vertical" spacing="xl">
            {/* Header */}
            <Stack direction="vertical" spacing="sm">
              <Title2>Dodaj fiszkę</Title2>
              <Body className="text-[hsl(var(--apple-label-secondary))]">
                Stwórz fiszkę ręcznie, wpisując pytanie i odpowiedź
              </Body>
            </Stack>

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
