import AiConnectionTest from "./AiConnectionTest";

type FirstRunSetupProps = {
    serverUrl: string;
    model: string;
    aiStatus: "checking" | "ready" | "offline";
    onServerUrlChange: (value: string) => void;
    onModelChange: (value: string) => void;
    onTestConnection: () => Promise<boolean>;
    onComplete: () => void;
};

export default function FirstRunSetup({
    serverUrl,
    model,
    aiStatus,
    onServerUrlChange,
    onModelChange,
    onTestConnection,
    onComplete,
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

                    <label>
                        Model
                    </label>

                    <input
                        type="text"
                        value={model}
                        onChange={(event) =>
                            onModelChange(
                                event.target.value
                            )
                        }
                        placeholder="llama3.1:latest"
                    />

                    <AiConnectionTest
                        aiStatus={aiStatus}
                        onTestConnection={onTestConnection}
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