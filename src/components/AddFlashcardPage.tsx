import { useState } from "react";
import { toast } from "sonner";
import { useAddFlashcard } from "@/hooks/useAddFlashcard";
import { AddFlashcardForm } from "./add-flashcard/AddFlashcardForm";
import { BookOpen } from "lucide-react";

// Apple HIG Components
import { Stack, Container, Title2, Body } from "./apple-hig";

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
    <div className="flex flex-col relative">
      {/* Subtle animated background pattern */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-[hsl(var(--apple-blue)/0.006)] to-transparent animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-[hsl(var(--apple-green)/0.012)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-1/2 left-1/4 w-72 h-72 bg-[hsl(var(--apple-blue)/0.008)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        <Container size="lg" className="py-[var(--apple-space-6)]">
          {/* Header Section */}
          <div className="mb-8">
            <Stack direction="vertical" spacing="sm">
              <Title2 className="text-[hsl(var(--apple-label))] font-[var(--apple-weight-bold)]">
                Dodaj fiszkę
              </Title2>
              <Body className="text-[hsl(var(--apple-label-secondary))]">
                Stwórz fiszkę ręcznie dla pełnej kontroli nad treścią
              </Body>
            </Stack>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <AddFlashcardForm key={formKey} onSubmit={handleSubmit} loading={loading} />
            </div>

            {/* Right Column - Tips */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[hsl(var(--apple-green)/0.15)] to-[hsl(var(--apple-blue)/0.15)] backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/25 shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-[hsl(var(--apple-green))] to-[hsl(var(--apple-blue))] bg-clip-text text-transparent">
                  Wskazówki
                </h3>
                <div className="space-y-3 text-sm text-[hsl(var(--apple-label-secondary))] leading-relaxed">
                  <p>• Używaj krótkich pytań i zwięzłych odpowiedzi</p>
                  <p>• Staraj się aby jedna fiszka zawierała jeden fakt</p>
                  <p>• Unikaj zbyt długich definicji</p>
                </div>
              </div>

              <div className="bg-white/65 dark:bg-black/18 backdrop-blur-sm rounded-2xl border border-[hsl(var(--apple-separator))]/28 shadow-md p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--apple-blue))]/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[hsl(var(--apple-blue))]" />
                  </div>
                  <h3 className="font-semibold text-[hsl(var(--apple-label))]">Przykład</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-[hsl(var(--apple-fill))]/10 rounded-lg">
                    <span className="font-medium text-[hsl(var(--apple-label-secondary))]">Pytanie:</span>
                    <p className="text-[hsl(var(--apple-label))]">Stolica Francji?</p>
                  </div>
                  <div className="p-3 bg-[hsl(var(--apple-fill))]/10 rounded-lg">
                    <span className="font-medium text-[hsl(var(--apple-label-secondary))]">Odpowiedź:</span>
                    <p className="text-[hsl(var(--apple-label))]">Paryż</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
