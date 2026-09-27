import { useState } from "react";
import type { Snippet } from "../data/mockSnippets";

type EditSnippetProps = {
    snippet: Snippet;
    onCancel: () => void;
    onSave: (snippet: Snippet) => void;
};

export default function EditSnippet({
    snippet,
    onCancel,
    onSave,
}: EditSnippetProps) {
    const [title, setTitle] = useState(snippet.title);
    const [tool, setTool] = useState(snippet.tool);
    const [environment, setEnvironment] = useState(
        snippet.environment
    );
    const [category, setCategory] = useState(
        snippet.category
    );
    const [description, setDescription] = useState(
        snippet.description
    );
    const [template, setTemplate] = useState(
        snippet.template
    );
    const [tags, setTags] = useState(
        snippet.tags.join(", ")
    );

    const handleSave = () => {
        if (!title.trim() || !template.trim()) {
            return;
        }

        onSave({
            ...snippet,
            title: title.trim(),
            tool: tool.trim(),
            environment: environment.trim(),
            category: category.trim(),
            description: description.trim(),
            template: template.trim(),
            tags: tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        });
    };

    return (
        <div className="detail-page">
            <div className="detail-container">
                <button
                    className="back-link"
                    onClick={onCancel}
                >
                    ← Cancel
                </button>

                <div className="detail-heading">
                    <div>
                        <h1>Edit Snippet</h1>
                        <p>Update snippet information and template.</p>
                    </div>
                </div>

                <section className="detail-section">
                    <div className="variable-input-list">
                        <div className="variable-input-group">
                            <label>Title</label>
                            <input
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />
                        </div>

                        <div className="variable-input-group">
                            <label>Tool</label>
                            <input
                                value={tool}
                                onChange={(event) =>
                                    setTool(event.target.value)
                                }
                            />
                        </div>

                        <div className="variable-input-group">
                            <label>Environment / Shell</label>
                            <input
                                value={environment}
                                onChange={(event) =>
                                    setEnvironment(event.target.value)
                                }
                            />
                        </div>

                        <div className="variable-input-group">
                            <label>Category</label>
                            <input
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                            />
                        </div>

                        <div className="variable-input-group">
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />
                        </div>

                        <div className="variable-input-group">
                            <label>Template</label>
                            <textarea
                                value={template}
                                onChange={(event) =>
                                    setTemplate(event.target.value)
                                }
                                rows={6}
                            />
                        </div>

                        <div className="variable-input-group">
                            <label>Tags</label>
                            <input
                                value={tags}
                                onChange={(event) =>
                                    setTags(event.target.value)
                                }
                                placeholder="kubernetes, logs, troubleshooting"
                            />
                        </div>
                    </div>
                </section>

                <div className="edit-actions">
                    <button
                        className="secondary-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary-button"
                        onClick={handleSave}
                        disabled={
                            !title.trim() || !template.trim()
                        }
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}