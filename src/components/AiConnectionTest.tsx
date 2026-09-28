import { useState } from "react";

type AiStatus =
    | "checking"
    | "ready"
    | "offline";

type AiConnectionTestProps = {
    aiStatus: AiStatus;
    onTestConnection: () => Promise<boolean>;
    buttonClassName?: string;
    showStatus?: boolean;
};

export default function AiConnectionTest({
    aiStatus,
    onTestConnection,
    buttonClassName = "secondary-button",
    showStatus = true,
}: AiConnectionTestProps) {
    const [testResult, setTestResult] =
        useState<"success" | "failed" | null>(null);

    const handleTestConnection = async () => {
        setTestResult(null);

        const success =
            await onTestConnection();

        setTestResult(
            success ? "success" : "failed"
        );
    };

    return (
        <>
            {showStatus && (
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
            )}

            <div className="ai-test-action">
                <button
                    className={buttonClassName}
                    onClick={
                        handleTestConnection
                    }
                    disabled={
                        aiStatus === "checking"
                    }
                >
                    {aiStatus === "checking"
                        ? "Testing..."
                        : "Test Connection"}
                </button>

                {testResult === "success" && (
                    <span className="ai-test-success">
                        Connection successful
                    </span>
                )}

                {testResult === "failed" && (
                    <span className="ai-test-failed">
                        Connection failed
                    </span>
                )}
            </div>
        </>
    );
}