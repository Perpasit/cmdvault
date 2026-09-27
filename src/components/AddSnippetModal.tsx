import { useState } from "react";

type AddSnippetModalProps = {
    onClose: () => void;

    onAnalyze: (
        content: string
    ) => Promise<void>;

    onAddManually: (
        content: string
    ) => void;
};

export default function AddSnippetModal({
    onClose,
    onAnalyze,
    onAddManually,
}: AddSnippetModalProps) {
    const [content, setContent] =
        useState("");

    const [isAnalyzing, setIsAnalyzing] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleAnalyze = async () => {
        const trimmedContent =
            content.trim();

        if (
            !trimmedContent ||
            isAnalyzing
        ) {
            return;
        }

        setIsAnalyzing(true);
        setError("");

        try {
            await onAnalyze(
                trimmedContent
            );
        } catch (error) {
            console.error(
                "Failed to analyze snippet:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : String(error)
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddManually = () => {
        const trimmedContent =
            content.trim();

        if (
            !trimmedContent ||
            isAnalyzing
        ) {
            return;
        }

        onAddManually(
            trimmedContent
        );
    };

    const handleClose = () => {
        if (isAnalyzing) {
            return;
        }

        onClose();
    };

    return (
        <div
            className="modal-backdrop"
            onMouseDown={handleClose}
        >
            <div
                className="modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="modal-header">
                    <div>
                        <h2>Add Snippet</h2>

                        <p>
                            Paste a command or
                            query you want to
                            reuse.
                        </p>
                    </div>

                    <button
                        className="modal-close"
                        onClick={handleClose}
                        aria-label="Close"
                        disabled={isAnalyzing}
                    >
                        ×
                    </button>
                </div>

                <div className="form-group">
                    <label htmlFor="snippet-content">
                        Command or Query
                    </label>

                    <textarea
                        id="snippet-content"
                        value={content}
                        onChange={(event) =>
                            setContent(
                                event.target.value
                            )
                        }
                        placeholder="kubectl get pods -n..."
                        autoFocus
                        disabled={isAnalyzing}
                    />

                    <span className="form-hint">
                        Multi-line snippets are
                        supported.
                    </span>
                </div>

                {error && (
                    <div className="analyze-error">
                        <strong>
                            Analysis failed
                        </strong>

                        <span>
                            {error}
                        </span>

                        <span>
                            You can retry or
                            continue manually
                            without AI.
                        </span>
                    </div>
                )}

                <div className="modal-actions">
                    <button
                        className="secondary-button"
                        onClick={handleClose}
                        disabled={isAnalyzing}
                    >
                        Cancel
                    </button>

                    <button
                        className="secondary-button"
                        onClick={
                            handleAddManually
                        }
                        disabled={
                            !content.trim() ||
                            isAnalyzing
                        }
                    >
                        Add Manually
                    </button>

                    <button
                        className="primary-button"
                        onClick={
                            handleAnalyze
                        }
                        disabled={
                            !content.trim() ||
                            isAnalyzing
                        }
                    >
                        {isAnalyzing
                            ? "Analyzing..."
                            : error
                                ? "Retry Analyze →"
                                : "Analyze →"}
                    </button>
                </div>
            </div>
        </div>
    );
}