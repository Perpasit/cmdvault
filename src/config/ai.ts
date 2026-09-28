export const AI_PROVIDERS = [
    {
        value: "ollama",
        label: "Ollama",
    },
] as const;

export const OLLAMA_MODELS = [
    "llama3.1:latest",
    "qwen3:8b",
] as const;

export const DEFAULT_AI_PROVIDER =
    "ollama";

export const DEFAULT_AI_MODEL =
    "llama3.1:latest";

export const DEFAULT_AI_SERVER_URL =
    "http://127.0.0.1:11434";

export type OllamaStatus = {
    available: boolean;
    modelInstalled: boolean;
};