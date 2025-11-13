import { z } from "zod";
import { OPENAI_API_KEY, OPENAI_URL } from "astro:env/server";

/**
 * Propozycja fiszki wygenerowana przez AI
 */
export interface FlashcardProposal {
  front: string;
  back: string;
}

/**
 * Interfejs dla sparsowanej odpowiedzi z API
 */
export interface ParsedResponse {
  flashcards: {
    front: string;
    back: string;
  }[];
}

/**
 * Interfejs dla surowej odpowiedzi z Azure OpenAI API
 */
interface AzureOpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string | null;
      function_call?: {
        name: string;
        arguments: string;
      };
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Konfiguracja serwisu Azure OpenAI
 */
export interface OpenAIServiceConfiguration {
  apiKey: string;
  endpoint: string;
  systemMessage: string;
}

/**
 * Błąd serwisu Azure OpenAI
 */
export class OpenAIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "OpenAIServiceError";
  }
}

/**
 * Alias dla kompatybilności wstecznej
 * @deprecated Użyj OpenAIServiceError zamiast tego
 */
export const AIServiceError = OpenAIServiceError;

/**
 * Schema walidacji dla odpowiedzi z funkcji generate_flashcards
 */
const FlashcardSchema = z.object({
  front: z.string().min(1).max(200),
  back: z.string().min(1).max(500),
});

const GenerateFlashcardsResponseSchema = z.object({
  flashcards: z.array(FlashcardSchema).min(1),
});

// Validate OpenAI endpoint format (Astro already validates presence and type)
function validateEndpoint(endpoint: string): void {
  if (!endpoint.startsWith("https://")) {
    throw new Error("Endpoint (OPENAI_URL) must use HTTPS protocol");
  }
}

/**
 * Service for communication with Azure OpenAI API
 *
 * Enables:
 * - Sending requests to Azure OpenAI model
 * - Parsing structured responses (function calling)
 * - Handling authorization, network and response format errors
 */
export class OpenAIService {
  public readonly configuration: OpenAIServiceConfiguration;

  private readonly _apiKey: string;
  private readonly _endpoint: string;

  /**
   * Azure OpenAI service constructor
   *
   * Uses environment variables defined in astro.config.mjs:
   * - OPENAI_API_KEY: API key for authorization
   * - OPENAI_URL: Full URL of Azure OpenAI API endpoint
   *   (e.g. https://{resource}.openai.azure.com/openai/deployments/{model}/chat/completions?api-version=2024-02-15-preview)
   */
  constructor() {
    // Validate endpoint format (Astro already validates presence and type)
    validateEndpoint(OPENAI_URL);

    this._apiKey = OPENAI_API_KEY;
    this._endpoint = OPENAI_URL.trim();

    // Default system message for flashcard generation
    const defaultSystemMessage =
      "You are an expert flashcard generator for language learners. Always respond with concise, clear definitions and examples. Your goal is to create front and back for a flashcard where front can have up to 200 characters and back up to 500 characters. Expected response should be in polish.";

    // Public configuration
    this.configuration = {
      apiKey: this._apiKey,
      endpoint: this._endpoint,
      systemMessage: defaultSystemMessage,
    };
  }

  /**
   * Sends a request to Azure OpenAI model
   *
   * @param message - User message
   * @param context - Optional conversation context (for future history implementation)
   * @returns Promise with raw API response
   * @throws {OpenAIServiceError} In case of authorization, network or format error
   */
  public async sendRequest(message: string, context?: unknown): Promise<AzureOpenAIResponse> {
    // Input validation
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      throw new OpenAIServiceError("User message cannot be empty", "INVALID_INPUT", 400);
    }

    // Input sanitization (basic protection against injection)
    const sanitizedMessage = message.trim().slice(0, 10000); // Length limit

    try {
      // Building payload
      const payload = this._buildPayload(sanitizedMessage, context);

      // Sending HTTP request - using full URL from environment variables
      const response = await fetch(this._endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this._apiKey,
        },
        body: JSON.stringify(payload),
      });

      // HTTP error handling
      if (!response.ok) {
        this._handleError(response, "HTTP_ERROR");

        // Attempt to extract error details from response
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData?.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch {
          // Ignore JSON parsing errors
        }

        throw new OpenAIServiceError(errorMessage, "HTTP_ERROR", response.status);
      }

      // Parsing response
      const data = await response.json();

      // Response structure validation
      if (!data || typeof data !== "object" || !Array.isArray(data.choices)) {
        throw new OpenAIServiceError("Invalid API response structure", "INVALID_RESPONSE_FORMAT", 500);
      }

      return data as AzureOpenAIResponse;
    } catch (error) {
      // Network and other error handling
      if (error instanceof OpenAIServiceError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new OpenAIServiceError("Connection error with Azure OpenAI API", "NETWORK_ERROR", 503);
      }

      this._handleError(error, "UNKNOWN_ERROR");
      throw new OpenAIServiceError(
        `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "UNKNOWN_ERROR",
        500
      );
    }
  }

  /**
   * Processes raw API response, parsing structured data
   *
   * @param rawResponse - Raw data from API
   * @returns Parsed response with validation
   * @throws {OpenAIServiceError} If response doesn't match { front, back } schema
   */
  public parseResponse(rawResponse: AzureOpenAIResponse): ParsedResponse {
    if (!rawResponse || !rawResponse.choices || rawResponse.choices.length === 0) {
      throw new OpenAIServiceError("No data in API response", "EMPTY_RESPONSE", 500);
    }

    const firstChoice = rawResponse.choices[0];

    // Check if response contains function_call
    if (!firstChoice.message.function_call) {
      throw new OpenAIServiceError("API response does not contain function_call", "MISSING_FUNCTION_CALL", 500);
    }

    const functionCall = firstChoice.message.function_call;

    // Parsing arguments as JSON
    let parsedArguments: unknown;
    try {
      parsedArguments = JSON.parse(functionCall.arguments);
    } catch {
      throw new OpenAIServiceError("Cannot parse arguments from function_call", "INVALID_JSON", 500);
    }

    // Validation using Zod schema
    const validationResult = GenerateFlashcardsResponseSchema.safeParse(parsedArguments);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((issue) => issue.message).join(", ");
      throw new OpenAIServiceError(`Response validation error: ${errorMessages}`, "VALIDATION_ERROR", 500);
    }

    return validationResult.data;
  }

  /**
   * Private method to build request payload
   *
   * @param message - User message (source text for flashcard generation)
   * @param _context - Optional conversation context (unused in current implementation)
   * @returns Payload ready to send in request
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _buildPayload(message: string, _context?: unknown): object {
    // Building user message with generation instruction
    const userMessage = `Create flashcards from the following text. Generate multiple flashcards that cover key concepts, definitions, and important information:\n\n${message}`;

    const messages = [
      {
        role: "system" as const,
        content: this.configuration.systemMessage,
      },
      {
        role: "user" as const,
        content: userMessage,
      },
    ];

    return {
      messages,
      functions: [
        {
          name: "generate_flashcards",
          description: "Generates flashcards with front and back text",
          parameters: {
            type: "object",
            properties: {
              flashcards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    front: {
                      type: "string",
                      description: "Text for the front of the flashcard (max 200 characters)",
                    },
                    back: {
                      type: "string",
                      description: "Text for the back of the flashcard (max 500 characters)",
                    },
                  },
                  required: ["front", "back"],
                },
              },
            },
            required: ["flashcards"],
          },
        },
      ],
      function_call: { name: "generate_flashcards" },
    };
  }

  /**
   * Private method for error handling
   *
   * @param error - Error to handle
   * @param errorType - Error type for classification
   */
  private _handleError(error: unknown, errorType: string): void {
    // Error logging (without sensitive data)
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = {
      type: errorType,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    // In production, a dedicated logging system can be used
    console.error("[OpenAIService Error]", errorDetails);

    // Authorization error handling
    if (errorType === "HTTP_ERROR" && error instanceof Response) {
      if (error.status === 401 || error.status === 403) {
        console.error("[OpenAIService] Authorization error - check API key");
      }
    }

    // Network error handling
    if (errorType === "NETWORK_ERROR") {
      console.error("[OpenAIService] Network error - check connection to Azure OpenAI");
    }
  }
}

/**
 * Generates flashcards using Azure OpenAI API
 *
 * Helper function that creates an OpenAIService instance and generates flashcards.
 * Maps OpenAIServiceError errors to appropriate codes for compatibility.
 *
 * @param sourceText - Source text to generate flashcards from (1000-10000 characters)
 * @returns Array of flashcard proposals generated by AI
 * @throws {OpenAIServiceError} In case of API, network or validation error
 */
export async function generateFlashcards(sourceText: string): Promise<FlashcardProposal[]> {
  try {
    // Create service instance (environment variables are already loaded at module level)
    const openAIService = new OpenAIService();

    // Send request to Azure OpenAI
    const rawResponse = await openAIService.sendRequest(sourceText);

    // Parsing response
    const parsedResponse = openAIService.parseResponse(rawResponse);

    // Mapping response to FlashcardProposal format
    return parsedResponse.flashcards.map((flashcard) => ({
      front: flashcard.front,
      back: flashcard.back,
    }));
  } catch (error) {
    // Mapping errors to appropriate codes for compatibility
    if (error instanceof OpenAIServiceError) {
      // Mapping error codes to appropriate HTTP codes
      let statusCode = error.statusCode;
      let code = error.code;

      // Mapping specific errors
      if (error.statusCode === 401 || error.statusCode === 403) {
        code = "AUTHENTICATION_ERROR";
      } else if (error.statusCode === 429) {
        code = "RATE_LIMIT_EXCEEDED";
      } else if (error.statusCode === 503 || error.code === "NETWORK_ERROR") {
        code = "SERVICE_UNAVAILABLE";
        statusCode = 503;
      }

      // Throw new error with mapped code
      throw new OpenAIServiceError(error.message, code, statusCode);
    }

    // Handling other errors
    if (error instanceof Error) {
      throw new OpenAIServiceError(error.message, "UNKNOWN_ERROR", 500);
    }

    throw new OpenAIServiceError("Unexpected error during flashcard generation", "UNKNOWN_ERROR", 500);
  }
}
