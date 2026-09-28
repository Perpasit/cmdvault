import AiConnectionTest from "./AiConnectionTest";

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

    onTestConnection: () => Promise<boolean>;

    onExportData: () => void;

    onImportData: () => void;
};

export default function Settings({
    serverUrl,
    model,
    aiStatus,
    onServerUrlChange,
    onModelChange,
    onTestConnection,
    onExportData,
    onImportData,
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