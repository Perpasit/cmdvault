import {
    useMemo,
    useState,
} from "react";

import type { Snippet } from "../data/mockSnippets";
import type { Collection } from "./Sidebar";
import CreatableSelect from "./CreatableSelect";

type EditSnippetProps = {
    snippet: Snippet;

    collections: Collection[];

    selectedCollectionIds: number[];

    onCancel: () => void;

    onSave: (
        snippet: Snippet,
        collectionIds: number[]
    ) => void;

    toolOptions: string[];

    environmentOptions: string[];

    getCategoryOptions: (
        tool: string
    ) => string[];
};

export default function EditSnippet({
    snippet,
    collections,
    selectedCollectionIds,
    onCancel,
    onSave,
    toolOptions,
    environmentOptions,
    getCategoryOptions,
}: EditSnippetProps) {
    const [title, setTitle] =
        useState(snippet.title);

    const [tool, setTool] =
        useState(snippet.tool);

    const [
        environment,
        setEnvironment,
    ] = useState(
        snippet.environment
    );

    const [
        category,
        setCategory,
    ] = useState(
        snippet.category
    );

    const [
        description,
        setDescription,
    ] = useState(
        snippet.description
    );

    const [
        template,
        setTemplate,
    ] = useState(
        snippet.template
    );

    const [tags, setTags] =
        useState(
            snippet.tags.join(", ")
        );

    const [
        collectionIds,
        setCollectionIds,
    ] = useState<number[]>(
        selectedCollectionIds
    );

    /*
     * Category options depend
     * on current Tool.
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
     * User is typing Tool.
     *
     * Don't reset Category yet.
     */
    const handleToolChange = (
        newTool: string
    ) => {
        setTool(newTool);
    };

    /*
     * User actually selected
     * a Tool from dropdown.
     *
     * Reset Category only when
     * Tool really changed.
     */
    const handleToolSelect = (
        newTool: string
    ) => {
        const oldTool =
            tool.trim().toLowerCase();

        const selectedTool =
            newTool
                .trim()
                .toLowerCase();

        setTool(newTool);

        if (
            oldTool !==
            selectedTool
        ) {
            setCategory("");
        }
    };

    /*
     * Select / unselect Collection
     */
    const toggleCollection = (
        collectionId: number
    ) => {
        setCollectionIds(
            (current) => {
                if (
                    current.includes(
                        collectionId
                    )
                ) {
                    return current.filter(
                        (id) =>
                            id !==
                            collectionId
                    );
                }

                return [
                    ...current,
                    collectionId,
                ];
            }
        );
    };

    const handleSave = () => {
        if (
            !title.trim() ||
            !template.trim()
        ) {
            return;
        }

        onSave(
            {
                ...snippet,

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

                template:
                    template.trim(),

                tags: tags
                    .split(",")
                    .map((tag) =>
                        tag.trim()
                    )
                    .filter(Boolean),
            },
            collectionIds
        );
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
                        <h1>
                            Edit Snippet
                        </h1>

                        <p>
                            Update snippet
                            information,
                            collections and
                            template.
                        </p>
                    </div>
                </div>

                <section className="detail-section">
                    <div className="variable-input-list">
                        <div className="variable-input-group">
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

                        <div className="variable-input-group">
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
                                onSelect={
                                    handleToolSelect
                                }
                                options={
                                    toolOptions
                                }
                                placeholder="Select or enter a tool"
                            />
                        </div>

                        <div className="variable-input-group">
                            <label>
                                Environment / Shell
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

                        <div className="variable-input-group">
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

                        <div className="variable-input-group">
                            <label>
                                Description
                            </label>

                            <textarea
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

                        <div className="variable-input-group">
                            <label>
                                Template
                            </label>

                            <textarea
                                value={
                                    template
                                }
                                onChange={(
                                    event
                                ) =>
                                    setTemplate(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                rows={6}
                            />
                        </div>

                        <div className="variable-input-group">
                            <label>
                                Collections
                            </label>

                            {collections.length >
                                0 ? (
                                <>
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
                                                        checked={collectionIds.includes(
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

                                    <span className="form-hint">
                                        A snippet
                                        can belong
                                        to multiple
                                        collections.
                                    </span>
                                </>
                            ) : (
                                <span className="form-hint">
                                    No collections
                                    available.
                                </span>
                            )}
                        </div>

                        <div className="variable-input-group">
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
                    </div>
                </section>

                <div className="edit-actions">
                    <button
                        className="secondary-button"
                        onClick={
                            onCancel
                        }
                    >
                        Cancel
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
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}