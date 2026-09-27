type AiStatus =
    | "checking"
    | "ready"
    | "offline";

type SettingsProps = {
    serverUrl: string;
    model: string;
    aiStatus: AiStatus;

    onServerUrlChange: (
        value: string
    ) => void;

    onModelChange: (
        value: string
    ) => void;

    onTestConnection: () => void;
};

export default function Settings({
    serverUrl,
    model,
    aiStatus,
    onServerUrlChange,
    onModelChange,
    onTestConnection,
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

                    <input
                        value="Ollama (Local)"
                        disabled
                    />

                    <span className="settings-help">
                        AI runs locally on
                        your machine.
                    </span>
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
                </div>

                <div className="settings-field">
                    <label>
                        Model
                    </label>

                    <input
                        value={model}
                        onChange={(event) =>
                            onModelChange(
                                event.target.value
                            )
                        }
                        placeholder="llama3.1:latest"
                    />
                </div>

                <div className="settings-connection">
                    <div
                        className={`ai-status ai-status-${aiStatus}`}
                    >
                        <span className="ai-status-dot" />

                        <span>
                            {aiStatus === "ready"
                                ? "AI Ready"
                                : aiStatus === "offline"
                                    ? "AI Offline"
                                    : "Checking AI"}
                        </span>
                    </div>

                    <button
                        className="secondary-button"
                        onClick={
                            onTestConnection
                        }
                        disabled={
                            aiStatus ===
                            "checking"
                        }
                    >
                        Test Connection
                    </button>
                </div>

                <p className="settings-save-note">
                    Changes are saved
                    automatically.
                </p>
            </section>
        </div>
    );
}