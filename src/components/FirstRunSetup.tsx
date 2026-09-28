import AiConnectionTest from "./AiConnectionTest";
import { openUrl } from "@tauri-apps/plugin-opener";

import {
    AI_PROVIDERS,
    OLLAMA_MODELS,
    type OllamaStatus,
} from "../config/ai";

type FirstRunSetupProps = {
    provider: string;
    serverUrl: string;
    model: string;
    aiStatus: "checking" | "ready" | "offline";
    ollamaStatus: OllamaStatus | null;

    onProviderChange: (value: string) => void;
    onServerUrlChange: (value: string) => void;
    onModelChange: (value: string) => void;
    onTestConnection: () => Promise<boolean>;
    onComplete: () => void;
    isInstallingModel: boolean;
    installModelError: string | null;
    onInstallModel: () => Promise<void>;
};

export default function FirstRunSetup({
    provider,
    serverUrl,
    model,
    aiStatus,
    ollamaStatus,
    onProviderChange,
    onServerUrlChange,
    onModelChange,
    onTestConnection,
    onComplete,
    isInstallingModel,
    installModelError,
    onInstallModel,
}: FirstRunSetupProps) {
    return (
        <div className="first-run-page">
            <div className="first-run-card">
                <h1>Welcome to CmdVault</h1>

                <p className="first-run-description">
                    Build your personal library of reusable
                    engineering commands and queries.
                </p>

                <div className="first-run-section">
                    <div className="first-run-section-header">
                        <div>
                            <h2>Local AI</h2>

                            <p>
                                Optional. CmdVault works without
                                Local AI.
                            </p>
                        </div>

                        <span
                            className={`ai-status ai-status-${aiStatus}`}
                        >
                            <span className="ai-status-dot" />

                            {aiStatus === "ready"
                                ? "AI Ready"
                                : aiStatus === "offline"
                                    ? "AI Offline"
                                    : "Checking AI"}
                        </span>
                    </div>

                    <label>
                        Provider
                    </label>

                    <select
                        value={provider}
                        onChange={(event) =>
                            onProviderChange(
                                event.target.value
                            )
                        }
                    >
                        {AI_PROVIDERS.map(
                            (providerOption) => (
                                <option
                                    key={
                                        providerOption.value
                                    }
                                    value={
                                        providerOption.value
                                    }
                                >
                                    {
                                        providerOption.label
                                    }
                                </option>
                            )
                        )}
                    </select>

                    <label>
                        Model
                    </label>

                    <select
                        value={model}
                        onChange={(event) =>
                            onModelChange(
                                event.target.value
                            )
                        }
                    >
                        {OLLAMA_MODELS.map(
                            (modelOption) => (
                                <option
                                    key={modelOption}
                                    value={modelOption}
                                >
                                    {modelOption}
                                </option>
                            )
                        )}
                    </select>

                    <label>
                        Server URL
                    </label>

                    <input
                        type="text"
                        value={serverUrl}
                        onChange={(event) =>
                            onServerUrlChange(
                                event.target.value
                            )
                        }
                        placeholder="http://127.0.0.1:11434"
                    />

                    {ollamaStatus && (
                        <div className="ai-install-status">
                            {!ollamaStatus.available ? (
                                <div className="ai-model-missing">
                                    <div>
                                        <div className="ai-test-failed">
                                            Cannot connect to Ollama
                                        </div>

                                        <div className="settings-help">
                                            Make sure Ollama is installed and running.
                                        </div>
                                    </div>

                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            openUrl(
                                                "https://ollama.com/download/windows"
                                            )
                                        }
                                    >
                                        Install Ollama
                                    </button>
                                </div>
                            ) : ollamaStatus.modelInstalled ? (
                                <span className="ai-test-success">
                                    ✓ This model is installed
                                </span>
                            ) : (
                                <div className="ai-model-missing">
                                    <span className="ai-test-failed">
                                        {model} is not installed
                                    </span>

                                    <button
                                        className="secondary-button"
                                        onClick={onInstallModel}
                                        disabled={isInstallingModel}
                                    >
                                        {isInstallingModel
                                            ? "Installing..."
                                            : "Install Model"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {installModelError && (
                        <div className="ai-test-failed">
                            {installModelError}
                        </div>
                    )}

                    <AiConnectionTest
                        aiStatus={aiStatus}
                        onTestConnection={
                            onTestConnection
                        }
                        buttonClassName="first-run-test-button"
                        showStatus={false}
                    />
                </div>

                <div className="first-run-actions">
                    <button
                        className="first-run-continue-button"
                        onClick={onComplete}
                    >
                        Start using CmdVault
                    </button>
                </div>
            </div>
        </div>
    );
}