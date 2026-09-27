import { useState } from "react";

type AddSnippetModalProps = {
    onClose: () => void;
    onAnalyze: (content: string) => void;
};

export default function AddSnippetModal({
    onClose,
    onAnalyze,
}: AddSnippetModalProps) {
    const [content, setContent] = useState("");

    const handleAnalyze = () => {
        const trimmedContent = content.trim();

        if (!trimmedContent) {
            return;
        }

        onAnalyze(trimmedContent);
    };

    return (
        <div className="modal-backdrop" onMouseDown={onClose}>
            <div
                className="modal"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <h2>Add Snippet</h2>
                        <p>Paste a command or query you want to reuse.</p>
                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close"
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
                            setContent(event.target.value)
                        }
                        placeholder="kubectl get pods -n..."
                        autoFocus
                    />

                    <span className="form-hint">
                        Multi-line snippets are supported.
                    </span>
                </div>

                <div className="modal-actions">
                    <button
                        className="secondary-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary-button"
                        onClick={handleAnalyze}
                        disabled={!content.trim()}
                    >
                        Analyze →
                    </button>
                </div>
            </div>
        </div>
    );
}