import {
    useMemo,
    useState,
} from "react";

import type { Snippet } from "../data/mockSnippets";
import CreatableSelect from "./CreatableSelect";

type SuggestedVariable = {
    id: number;
    original: string;
    name: string;
    enabled: boolean;
};

type ReviewSnippetProps = {
    content: string;

    onBack: () => void;

    onSave: (
        snippet: Omit<
            Snippet,
            "id" | "createdAt"
        >
    ) => void;

    toolOptions: string[];

    environmentOptions: string[];

    getCategoryOptions: (
        tool: string
    ) => string[];
};

export default function ReviewSnippet({
    content,
    onBack,
    onSave,
    toolOptions,
    environmentOptions,
    getCategoryOptions,
}: ReviewSnippetProps) {
    const [title, setTitle] =
        useState("Untitled Snippet");

    const [tool, setTool] =
        useState("");

    const [
        environment,
        setEnvironment,
    ] = useState("");

    const [
        category,
        setCategory,
    ] = useState("");

    const [
        description,
        setDescription,
    ] = useState("");

    const [tags, setTags] =
        useState("");

    /*
     * Mock Suggested Variables
     *
     * Local AI will replace this later.
     */
    const [
        variables,
        setVariables,
    ] = useState<
        SuggestedVariable[]
    >([
        {
            id: 1,
            original:
                "payment-api-7db8d",
            name: "pod_name",
            enabled: true,
        },
        {
            id: 2,
            original:
                "payment-dev",
            name: "namespace",
            enabled: true,
        },
        {
            id: 3,
            original: "100",
            name: "tail_lines",
            enabled: true,
        },
    ]);

    /*
     * Dynamic Categories.
     *
     * No Tool:
     * show all available Categories.
     *
     * Tool selected:
     * show Categories related
     * to that Tool.
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
     */
    const template =
        useMemo(() => {
            let result =
                content;

            variables.forEach(
                (variable) => {
                    if (
                        variable.enabled &&
                        variable.name.trim()
                    ) {
                        result =
                            result
                                .split(
                                    variable.original
                                )
                                .join(
                                    `{{${variable.name.trim()}}}`
                                );
                    }
                }
            );

            return result;
        }, [
            content,
            variables,
        ]);

    const toggleVariable = (
        id: number
    ) => {
        setVariables(
            (current) =>
                current.map(
                    (
                        variable
                    ) =>
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

    const renameVariable = (
        id: number,
        name: string
    ) => {
        setVariables(
            (current) =>
                current.map(
                    (
                        variable
                    ) =>
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

    const handleSave = () => {
        const parsedTags =
            tags
                .split(",")
                .map((tag) =>
                    tag.trim()
                )
                .filter(Boolean);

        onSave({
            title:
                title.trim(),

            tool:
                tool.trim(),

            environment:
                environment.trim(),

            category:
                category.trim(),

            description:
                description.trim(),

            template,

            tags:
                parsedTags,
        });
    };

    return (
        <div className="review-page">
            <div className="review-container">
                <div className="review-heading">
                    <div>
                        <button
                            className="back-link"
                            onClick={
                                onBack
                            }
                        >
                            ← Back
                        </button>

                        <h1>
                            Review &
                            Edit
                        </h1>

                        <p>
                            Review the
                            suggestions
                            before
                            saving this
                            snippet.
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
                                Choose
                                which
                                values
                                should
                                become
                                reusable
                                variables.
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

                                        <code className="variable-original">
                                            {
                                                variable.original
                                            }
                                        </code>

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
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="no-variables">
                            No
                            variables
                            suggested.
                        </p>
                    )}
                </section>

                <section className="review-section">
                    <h2>
                        Reusable
                        Template
                    </h2>

                    <pre className="review-code template-preview">
                        <code>
                            {
                                template
                            }
                        </code>
                    </pre>
                </section>

                <div className="review-actions">
                    <button
                        className="secondary-button"
                        onClick={
                            onBack
                        }
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
                            !template.trim()
                        }
                    >
                        Save
                        Snippet
                    </button>
                </div>
            </div>
        </div>
    );
}