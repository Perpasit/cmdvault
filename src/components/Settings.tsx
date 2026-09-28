import AiConnectionTest from "./AiConnectionTest";
import { openUrl } from "@tauri-apps/plugin-opener";

import {
    AI_PROVIDERS,
    OLLAMA_MODELS,
    type OllamaStatus,
} from "../config/ai";

type AiStatus =
    | "checking"
    | "ready"
    | "offline";

type SettingsProps = {
    provider: string;
    serverUrl: string;
    model: string;
    aiStatus: AiStatus;

    onProviderChange: (
        value: string
    ) => void;

    ollamaStatus: OllamaStatus | null;

    onServerUrlChange: (
        value: string
    ) => void;

    onModelChange: (
        value: string
    ) => void;

    onTestConnection: () => Promise<boolean>;

    onExportData: () => void;

    onImportData: () => void;

    isInstallingModel: boolean;
    installModelError: string | null;
    onInstallModel: () => Promise<void>;
};

export default function Settings({
    provider,
    serverUrl,
    model,
    aiStatus,
    ollamaStatus,
    onProviderChange,
    onServerUrlChange,
    onModelChange,
    onTestConnection,
    onExportData,
    onImportData,
    isInstallingModel,
    installModelError,
    onInstallModel,
}: SettingsProps) {
    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Settings</h1>

                <p>
                    Configure CmdVault
                    preferences and Local AI.
                </p>
            </div>

            <section className="settings-section">
                <div className="settings-section-header">
                    <h2>Local AI</h2>

                    <p>
                        Configure the local AI
                        used to analyze snippets.
                    </p>
                </div>

                <div className="settings-field">
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

                    <span className="settings-help">
                        Ollama is the supported
                        Local AI provider in this
                        release.
                    </span>
                </div>

                <div className="settings-field">
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
                </div>

                <div className="settings-field">
                    <label>
                        Server URL
                    </label>

                    <input
                        value={serverUrl}
                        onChange={(event) =>
                            onServerUrlChange(
                                event.target.value
                            )
                        }
                        placeholder="http://127.0.0.1:11434"
                    />

                    <span className="settings-help">
                        Default Ollama server:
                        http://127.0.0.1:11434
                    </span>
                </div>

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

                <div className="settings-connection">
                    <AiConnectionTest
                        aiStatus={aiStatus}
                        onTestConnection={
                            onTestConnection
                        }
                    />
                </div>

                <p className="settings-save-note">
                    Changes are saved
                    automatically.
                </p>
            </section>

            <section className="settings-section">
                <div className="settings-section-header">
                    <h2>Data</h2>

                    <p>
                        Back up or transfer your
                        CmdVault data.
                    </p>
                </div>

                <div className="settings-data-row">
                    <div>
                        <strong>
                            Export Data
                        </strong>

                        <p className="settings-help">
                            Export your snippets and
                            collections as a CmdVault
                            backup file.
                        </p>
                    </div>

                    <button
                        className="secondary-button"
                        onClick={onExportData}
                    >
                        Export Data
                    </button>
                </div>

                <div className="settings-data-row">
                    <div>
                        <strong>
                            Import Data
                        </strong>

                        <p className="settings-help">
                            Restore snippets and
                            collections from a CmdVault
                            backup file.
                        </p>
                    </div>

                    <button
                        className="secondary-button"
                        onClick={onImportData}
                    >
                        Import Data
                    </button>
                </div>
            </section>
        </div>
    );
}