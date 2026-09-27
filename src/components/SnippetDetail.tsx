import { useMemo, useState } from "react";
import type { Snippet } from "../data/mockSnippets";
import type { Collection } from "./Sidebar";

type SnippetDetailProps = {
    snippet: Snippet;
    collections: Collection[];
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function SnippetDetail({
    snippet,
    collections,
    onBack,
    onEdit,
    onDelete,
}: SnippetDetailProps) {
    const variableNames = useMemo(() => {
        const matches =
            snippet.template.matchAll(
                /\{\{([^{}]+)\}\}/g
            );

        return Array.from(
            new Set(
                Array.from(matches).map(
                    (match) =>
                        match[1].trim()
                )
            )
        );
    }, [snippet.template]);

    const [
        variableValues,
        setVariableValues,
    ] = useState<
        Record<string, string>
    >(() =>
        Object.fromEntries(
            variableNames.map(
                (name) => [name, ""]
            )
        )
    );

    const resolvedSnippet = useMemo(() => {
        let result = snippet.template;

        variableNames.forEach(
            (name) => {
                const value =
                    variableValues[name];

                if (value) {
                    result = result
                        .split(
                            `{{${name}}}`
                        )
                        .join(value);
                }
            }
        );

        return result;
    }, [
        snippet.template,
        variableNames,
        variableValues,
    ]);

    const hasVariables =
        variableNames.length > 0;

    const allVariablesFilled =
        variableNames.every(
            (name) =>
                variableValues[
                    name
                ]?.trim()
        );

    const handleVariableChange = (
        name: string,
        value: string
    ) => {
        setVariableValues(
            (current) => ({
                ...current,
                [name]: value,
            })
        );
    };

    const copyResolvedSnippet =
        async () => {
            await navigator.clipboard.writeText(
                resolvedSnippet
            );
        };

    return (
        <div className="detail-page">
            <div className="detail-container">
                <button
                    className="back-link"
                    onClick={onBack}
                >
                    ← Back to Library
                </button>

                <div className="detail-heading">
                    <div>
                        <h1>
                            {snippet.title}
                        </h1>

                        <p>
                            {snippet.tool} ·{" "}
                            {
                                snippet.category
                            }
                        </p>
                    </div>

                    <div className="detail-heading-actions">
                        <div className="detail-actions">
                            <button
                                className="detail-action-button"
                                onClick={
                                    onEdit
                                }
                            >
                                Edit
                            </button>

                            <span className="action-divider">
                                ·
                            </span>

                            <button
                                className="detail-action-button delete-action"
                                onClick={
                                    onDelete
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {snippet.description && (
                    <section className="detail-section">
                        <h2>
                            Description
                        </h2>

                        <p className="detail-description">
                            {
                                snippet.description
                            }
                        </p>
                    </section>
                )}

                <section className="detail-section">
                    <h2>
                        Template
                    </h2>

                    <pre className="review-code">
                        <code>
                            {
                                snippet.template
                            }
                        </code>
                    </pre>
                </section>

                {hasVariables && (
                    <section className="detail-section">
                        <div className="detail-section-heading">
                            <h2>
                                Variables
                            </h2>

                            <p>
                                Fill in the
                                values before
                                copying the
                                snippet.
                            </p>
                        </div>

                        <div className="variable-input-list">
                            {variableNames.map(
                                (name) => (
                                    <div
                                        className="variable-input-group"
                                        key={
                                            name
                                        }
                                    >
                                        <label
                                            htmlFor={`variable-${name}`}
                                        >
                                            {
                                                name
                                            }
                                        </label>

                                        <input
                                            id={`variable-${name}`}
                                            value={
                                                variableValues[
                                                name
                                                ] ??
                                                ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleVariableChange(
                                                    name,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder={`Enter ${name}`}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                )}

                <section className="detail-section">
                    <div className="preview-heading">
                        <div>
                            <h2>
                                Preview
                            </h2>

                            {hasVariables &&
                                !allVariablesFilled && (
                                    <p>
                                        Fill
                                        all
                                        variables
                                        to
                                        create
                                        the
                                        final
                                        snippet.
                                    </p>
                                )}
                        </div>

                        <button
                            className="primary-button"
                            onClick={
                                copyResolvedSnippet
                            }
                            disabled={
                                hasVariables &&
                                !allVariablesFilled
                            }
                        >
                            Copy
                        </button>
                    </div>

                    <pre className="review-code template-preview">
                        <code>
                            {
                                resolvedSnippet
                            }
                        </code>
                    </pre>
                </section>

                {collections.length > 0 && (
                    <section className="detail-section">
                        <h2>
                            Collections
                        </h2>

                        <div className="detail-tags">
                            {collections.map(
                                (
                                    collection
                                ) => (
                                    <span
                                        key={
                                            collection.id
                                        }
                                    >
                                        {
                                            collection.name
                                        }
                                    </span>
                                )
                            )}
                        </div>
                    </section>
                )}

                <section className="detail-section">
                    <h2>
                        Environment / Shell
                    </h2>

                    <p className="detail-value">
                        {
                            snippet.environment
                        }
                    </p>
                </section>

                <section className="detail-section">
                    <h2>
                        Tags
                    </h2>

                    <div className="detail-tags">
                        {snippet.tags.map(
                            (tag) => (
                                <span
                                    key={
                                        tag
                                    }
                                >
                                    {tag}
                                </span>
                            )
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}