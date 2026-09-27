import { useState } from "react";

type AddSnippetModalProps = {
    onClose: () => void;
    onAnalyze: (type: string, content: string) => void;
};

export default function AddSnippetModal({
    onClose,
    onAnalyze,
}: AddSnippetModalProps) {
    const [type, setType] = useState("cli");
    const [content, setContent] = useState("");

    const handleAnalyze = () => {
        if (!content.trim()) {
            return;
        }

        onAnalyze(type, content.trim());
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
                    <label htmlFor="snippet-type">Type</label>

                    <select
                        id="snippet-type"
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                    >
                        <option value="cli">CLI Command</option>
                        <option value="sql">SQL Query</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="snippet-content">
                        Command or Query
                    </label>

                    <textarea
                        id="snippet-content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder={
                            type === "sql"
                                ? "SELECT * FROM users WHERE..."
                                : "kubectl get pods -n..."
                        }
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