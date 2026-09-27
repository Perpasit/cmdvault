import { useMemo, useState } from "react";
import type { Snippet } from "../data/mockSnippets";

type SuggestedVariable = {
    id: number;
    original: string;
    name: string;
    enabled: boolean;
};

type ReviewSnippetProps = {
    type: string;
    content: string;
    onBack: () => void;
    onSave: (snippet: Omit<Snippet, "id" | "createdAt">) => void;
};

export default function ReviewSnippet({
    type,
    content,
    onBack,
    onSave,
}: ReviewSnippetProps) {
    const isSQL = type === "sql";

    const [title, setTitle] = useState(
        isSQL ? "SQL Query" : "Check Kubernetes Pod Logs"
    );

    const [tool, setTool] = useState(
        isSQL ? "SQL" : "Kubernetes"
    );

    const [environment, setEnvironment] = useState(
        isSQL ? "SQL" : "Bash / Shell"
    );

    const [category, setCategory] = useState(
        isSQL ? "Data Validation" : "Logs"
    );

    const [description, setDescription] = useState(
        isSQL
            ? "Reusable SQL query."
            : "View recent logs from a pod in a namespace."
    );

    const [tags, setTags] = useState(
        isSQL
            ? "sql, database"
            : "kubernetes, logs, troubleshooting"
    );

    const [variables, setVariables] = useState<SuggestedVariable[]>(
        isSQL
            ? []
            : [
                {
                    id: 1,
                    original: "payment-api-7db8d",
                    name: "pod_name",
                    enabled: true,
                },
                {
                    id: 2,
                    original: "payment-dev",
                    name: "namespace",
                    enabled: true,
                },
                {
                    id: 3,
                    original: "100",
                    name: "tail_lines",
                    enabled: true,
                },
            ]
    );

    const template = useMemo(() => {
        let result = content;

        variables.forEach((variable) => {
            if (variable.enabled && variable.name.trim()) {
                result = result.split(variable.original).join(
                    `{{${variable.name.trim()}}}`
                );
            }
        });

        return result;
    }, [content, variables]);

    const toggleVariable = (id: number) => {
        setVariables((current) =>
            current.map((variable) =>
                variable.id === id
                    ? { ...variable, enabled: !variable.enabled }
                    : variable
            )
        );
    };

    const renameVariable = (id: number, name: string) => {
        setVariables((current) =>
            current.map((variable) =>
                variable.id === id
                    ? { ...variable, name }
                    : variable
            )
        );
    };

    const handleSave = () => {
        const parsedTags = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        onSave({
            type: isSQL ? "sql" : "cli",
            title: title.trim(),
            tool,
            environment,
            category: category.trim(),
            description: description.trim(),
            template,
            tags: parsedTags,
        });
    };

    return (
        <div className="review-page">
            <div className="review-container">
                <div className="review-heading">
                    <div>
                        <button className="back-link" onClick={onBack}>
                            ← Back
                        </button>

                        <h1>Review & Edit</h1>

                        <p>
                            Review the suggestions before saving this snippet.
                        </p>
                    </div>

                    <span className="ai-badge">AI Suggestion</span>
                </div>

                <section className="review-section">
                    <h2>Details</h2>

                    <div className="review-grid">
                        <div className="form-group full-width">
                            <label>Title</label>
                            <input
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Tool</label>
                            <select
                                value={tool}
                                onChange={(event) =>
                                    setTool(event.target.value)
                                }
                            >
                                <option>Kubernetes</option>
                                <option>Terraform</option>
                                <option>Azure CLI</option>
                                <option>PowerShell</option>
                                <option>Docker</option>
                                <option>Git</option>
                                <option>SQL</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Environment / Shell</label>
                            <select
                                value={environment}
                                onChange={(event) =>
                                    setEnvironment(event.target.value)
                                }
                            >
                                <option>Bash / Shell</option>
                                <option>PowerShell</option>
                                <option>Windows CMD</option>
                                <option>SQL</option>
                                <option>Generic CLI</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <input
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Tags</label>
                            <input
                                value={tags}
                                onChange={(event) =>
                                    setTags(event.target.value)
                                }
                                placeholder="kubernetes, logs, troubleshooting"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                className="description-input"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="review-section">
                    <h2>Original</h2>

                    <pre className="review-code">
                        <code>{content}</code>
                    </pre>
                </section>

                <section className="review-section">
                    <div className="section-title-row">
                        <div>
                            <h2>Suggested Variables</h2>
                            <p>
                                Choose which values should become reusable
                                variables.
                            </p>
                        </div>
                    </div>

                    {variables.length > 0 ? (
                        <div className="variable-list">
                            {variables.map((variable) => (
                                <div
                                    className="variable-row"
                                    key={variable.id}
                                >
                                    <input
                                        type="checkbox"
                                        checked={variable.enabled}
                                        onChange={() =>
                                            toggleVariable(variable.id)
                                        }
                                    />

                                    <code className="variable-original">
                                        {variable.original}
                                    </code>

                                    <span className="variable-arrow">→</span>

                                    <input
                                        className="variable-name"
                                        value={variable.name}
                                        disabled={!variable.enabled}
                                        onChange={(event) =>
                                            renameVariable(
                                                variable.id,
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-variables">
                            No variables suggested.
                        </p>
                    )}
                </section>

                <section className="review-section">
                    <h2>Reusable Template</h2>

                    <pre className="review-code template-preview">
                        <code>{template}</code>
                    </pre>
                </section>

                <div className="review-actions">
                    <button
                        className="secondary-button"
                        onClick={onBack}
                    >
                        Back
                    </button>

                    <button
                        className="primary-button"
                        onClick={handleSave}
                        disabled={!title.trim() || !template.trim()}
                    >
                        Save Snippet
                    </button>
                </div>
            </div>
        </div>
    );
}