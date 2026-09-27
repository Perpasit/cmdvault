import {
    useEffect,
    useState,
} from "react";

type CreateCollectionModalProps = {
    existingNames: string[];
    onClose: () => void;
    onCreate: (name: string) => void;
};

export default function CreateCollectionModal({
    existingNames,
    onClose,
    onCreate,
}: CreateCollectionModalProps) {
    const [name, setName] =
        useState("");

    const [error, setError] =
        useState("");

    const handleCreate = () => {
        const trimmedName =
            name.trim();

        if (!trimmedName) {
            return;
        }

        const alreadyExists =
            existingNames.some(
                (existingName) =>
                    existingName
                        .trim()
                        .toLowerCase() ===
                    trimmedName.toLowerCase()
            );

        if (alreadyExists) {
            setError(
                "This collection already exists."
            );
            return;
        }

        onCreate(trimmedName);
    };

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [onClose]);

    return (
        <div
            className="modal-backdrop"
            onMouseDown={onClose}
        >
            <div
                className="modal collection-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="modal-header">
                    <div>
                        <h2>
                            Create Collection
                        </h2>

                        <p>
                            Group related snippets
                            together.
                        </p>
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
                    <label htmlFor="collection-name">
                        Collection Name
                    </label>

                    <input
                        id="collection-name"
                        value={name}
                        onChange={(event) => {
                            setName(
                                event.target.value
                            );
                            setError("");
                        }}
                        onKeyDown={(event) => {
                            if (
                                event.key ===
                                "Enter"
                            ) {
                                handleCreate();
                            }
                        }}
                        placeholder="e.g. AKS Troubleshooting"
                        autoFocus
                    />

                    {error && (
                        <span className="form-error">
                            {error}
                        </span>
                    )}
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
                        onClick={
                            handleCreate
                        }
                        disabled={
                            !name.trim()
                        }
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}