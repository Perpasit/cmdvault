import {
    useMemo,
    useState,
} from "react";

import type { Snippet } from "../data/mockSnippets";
import CreatableSelect from "./CreatableSelect";
import type { Collection } from "./Sidebar";

type SuggestedVariable = {
    id: number;
    original: string;
    name: string;
    enabled: boolean;
};

type AnalyzeVariable = {
    name: string;
    value: string;
};

type AnalyzeResult = {
    title: string;
    tool: string;
    environment: string;
    category: string;
    description: string;
    template: string;
    variables: AnalyzeVariable[];
    tags: string[];
};

type ReviewSnippetProps = {
    content: string;
    analysis: AnalyzeResult;

    onBack: () => void;

    onSave: (
        snippet: Omit<
            Snippet,
            "id" | "createdAt"
        >,
        collectionIds: number[]
    ) => void;

    toolOptions: string[];

    environmentOptions: string[];

    getCategoryOptions: (
        tool: string
    ) => string[];

    collections: Collection[];
};

export default function ReviewSnippet({
    content,
    analysis,
    onBack,
    onSave,
    toolOptions,
    environmentOptions,
    getCategoryOptions,
    collections,
}: ReviewSnippetProps) {
    const [title, setTitle] =
        useState(analysis.title);

    const [tool, setTool] =
        useState(analysis.tool);

    const [
        environment,
        setEnvironment,
    ] = useState(
        analysis.environment
    );

    const [
        category,
        setCategory,
    ] = useState(
        analysis.category
    );

    const [
        description,
        setDescription,
    ] = useState(
        analysis.description
    );

    const [tags, setTags] =
        useState(
            analysis.tags.join(", ")
        );

    const [
        selectedCollectionIds,
        setSelectedCollectionIds,
    ] = useState<number[]>([]);

    /*
     * AI Suggested Variables
     *
     * Manual mode will start with
     * an empty array.
     */
    const [
        variables,
        setVariables,
    ] = useState<SuggestedVariable[]>(
        analysis.variables.map(
            (variable, index) => ({
                id: index + 1,
                original:
                    variable.value,
                name:
                    variable.name,
                enabled: true,
            })
        )
    );

    /*
     * Dynamic Categories
     */
    const categoryOptions =
        useMemo(
            () =>
                getCategoryOptions(
                    tool
                ),
            [
                tool,
                getCategoryOptions,
            ]
        );

    /*
     * Reusable Template
     *
     * Start from the original content.
     * Enabled variables replace their
     * original values with {{name}}.
     */
    const template =
        useMemo(() => {
            let result = content;

            variables.forEach(
                (variable) => {
                    const original =
                        variable.original.trim();

                    const name =
                        variable.name.trim();

                    if (
                        variable.enabled &&
                        original &&
                        name
                    ) {
                        result =
                            result
                                .split(
                                    original
                                )
                                .join(
                                    `{{${name}}}`
                                );
                    }
                }
            );

            return result;
        }, [
            content,
            variables,
        ]);

    /*
     * Enable / Disable Variable
     */
    const toggleVariable = (
        id: number
    ) => {
        setVariables(
            (current) =>
                current.map(
                    (variable) =>
                        variable.id ===
                            id
                            ? {
                                ...variable,
                                enabled:
                                    !variable.enabled,
                            }
                            : variable
                )
        );
    };

    /*
     * Rename Variable
     */
    const renameVariable = (
        id: number,
        name: string
    ) => {
        setVariables(
            (current) =>
                current.map(
                    (variable) =>
                        variable.id ===
                            id
                            ? {
                                ...variable,
                                name,
                            }
                            : variable
                )
        );
    };

    /*
     * Change Original Value
     *
     * Useful for manually-created
     * variables or correcting an
     * AI suggestion.
     */
    const updateVariableOriginal = (
        id: number,
        original: string
    ) => {
        setVariables(
            (current) =>
                current.map(
                    (variable) =>
                        variable.id ===
                            id
                            ? {
                                ...variable,
                                original,
                            }
                            : variable
                )
        );
    };

    /*
     * Add Variable Manually
     */
    const addVariable = () => {
        setVariables(
            (current) => {
                const nextId =
                    current.length > 0
                        ? Math.max(
                            ...current.map(
                                (
                                    variable
                                ) =>
                                    variable.id
                            )
                        ) + 1
                        : 1;

                return [
                    ...current,
                    {
                        id: nextId,
                        original: "",
                        name: "",
                        enabled: true,
                    },
                ];
            }
        );
    };

    /*
     * Remove Variable
     */
    const removeVariable = (
        id: number
    ) => {
        setVariables(
            (current) =>
                current.filter(
                    (variable) =>
                        variable.id !== id
                )
        );
    };

    /*
     * Tool -> Category relationship
     *
     * When Tool changes,
     * reset Category so the user
     * can select a relevant one.
     */
    const handleToolChange = (
        newTool: string
    ) => {
        setTool(newTool);
        setCategory("");
    };

    /*
     * Collections
     */
    const toggleCollection = (
        collectionId: number
    ) => {
        setSelectedCollectionIds(
            (current) =>
                current.includes(
                    collectionId
                )
                    ? current.filter(
                        (id) =>
                            id !==
                            collectionId
                    )
                    : [
                        ...current,
                        collectionId,
                    ]
        );
    };

    /*
     * Save
     */
    const handleSave = () => {
        const parsedTags =
            tags
                .split(",")
                .map((tag) =>
                    tag.trim()
                )
                .filter(Boolean);

        onSave(
            {
                title: title.trim(),
                tool: tool.trim(),
                environment:
                    environment.trim(),
                category:
                    category.trim(),
                description:
                    description.trim(),
                template,
                tags: parsedTags,
            },
            selectedCollectionIds
        );
    };

    return (
        <div className="review-page">
            <div className="review-container">
                <div className="review-heading">
                    <div>
                        <button
                            className="back-link"
                            onClick={onBack}
                        >
                            ← Back
                        </button>

                        <h1>
                            Review & Edit
                        </h1>

                        <p>
                            Review the
                            suggestions before
                            saving this snippet.
                        </p>
                    </div>

                    <span className="ai-badge">
                        AI Suggestion
                    </span>
                </div>

                <section className="review-section">
                    <h2>
                        Details
                    </h2>

                    <div className="review-grid">
                        <div className="form-group full-width">
                            <label>
                                Title
                            </label>

                            <input
                                value={
                                    title
                                }
                                onChange={(
                                    event
                                ) =>
                                    setTitle(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Tool
                            </label>

                            <CreatableSelect
                                value={
                                    tool
                                }
                                onChange={
                                    handleToolChange
                                }
                                options={
                                    toolOptions
                                }
                                placeholder="Select or enter a tool"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Environment /
                                Shell
                            </label>

                            <CreatableSelect
                                value={
                                    environment
                                }
                                onChange={
                                    setEnvironment
                                }
                                options={
                                    environmentOptions
                                }
                                placeholder="Select or enter an environment"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Category
                            </label>

                            <CreatableSelect
                                value={
                                    category
                                }
                                onChange={
                                    setCategory
                                }
                                options={
                                    categoryOptions
                                }
                                placeholder="Select or enter a category"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Tags
                            </label>

                            <input
                                value={
                                    tags
                                }
                                onChange={(
                                    event
                                ) =>
                                    setTags(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="kubernetes, logs, troubleshooting"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>
                                Description
                            </label>

                            <textarea
                                className="description-input"
                                value={
                                    description
                                }
                                onChange={(
                                    event
                                ) =>
                                    setDescription(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>
                                Collections
                            </label>

                            {collections.length >
                                0 ? (
                                <div className="collection-options">
                                    {collections.map(
                                        (
                                            collection
                                        ) => (
                                            <label
                                                className="collection-option"
                                                key={
                                                    collection.id
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCollectionIds.includes(
                                                        collection.id
                                                    )}
                                                    onChange={() =>
                                                        toggleCollection(
                                                            collection.id
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {
                                                        collection.name
                                                    }
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            ) : (
                                <span className="form-hint">
                                    No collections
                                    yet.
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                <section className="review-section">
                    <h2>
                        Original
                    </h2>

                    <pre className="review-code">
                        <code>
                            {content}
                        </code>
                    </pre>
                </section>

                <section className="review-section">
                    <div className="section-title-row">
                        <div>
                            <h2>
                                Suggested
                                Variables
                            </h2>

                            <p>
                                Choose which
                                values should
                                become reusable
                                variables, or
                                add your own.
                            </p>
                        </div>
                    </div>

                    {variables.length >
                        0 ? (
                        <div className="variable-list">
                            {variables.map(
                                (
                                    variable
                                ) => (
                                    <div
                                        className="variable-row"
                                        key={
                                            variable.id
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                variable.enabled
                                            }
                                            onChange={() =>
                                                toggleVariable(
                                                    variable.id
                                                )
                                            }
                                        />

                                        <input
                                            className="variable-original-input"
                                            value={
                                                variable.original
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateVariableOriginal(
                                                    variable.id,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Original value"
                                        />

                                        <span className="variable-arrow">
                                            →
                                        </span>

                                        <input
                                            className="variable-name"
                                            value={
                                                variable.name
                                            }
                                            disabled={
                                                !variable.enabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                renameVariable(
                                                    variable.id,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="variable_name"
                                        />

                                        <button
                                            type="button"
                                            className="variable-remove-button"
                                            onClick={() =>
                                                removeVariable(
                                                    variable.id
                                                )
                                            }
                                            aria-label="Remove variable"
                                            title="Remove variable"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="no-variables">
                            No variables added
                            yet.
                        </p>
                    )}

                    <button
                        type="button"
                        className="add-variable-button"
                        onClick={
                            addVariable
                        }
                    >
                        + Add Variable
                    </button>
                </section>

                <section className="review-section">
                    <h2>
                        Reusable Template
                    </h2>

                    <pre className="review-code template-preview">
                        <code>
                            {template}
                        </code>
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
                        onClick={
                            handleSave
                        }
                        disabled={
                            !title.trim() ||
                            !tool.trim() ||
                            !environment.trim() ||
                            !category.trim()
                        }
                    >
                        Save Snippet
                    </button>
                </div>
            </div>
        </div>
    );
}