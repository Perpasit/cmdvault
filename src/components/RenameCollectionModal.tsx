import {
    useEffect,
    useState,
} from "react";

type RenameCollectionModalProps = {
    currentName: string;

    existingNames: string[];

    onClose: () => void;

    onRename: (
        name: string
    ) => void;
};

export default function RenameCollectionModal({
    currentName,
    existingNames,
    onClose,
    onRename,
}: RenameCollectionModalProps) {
    const [name, setName] =
        useState(currentName);

    useEffect(() => {
        setName(currentName);
    }, [currentName]);

    const trimmedName =
        name.trim();

    const isDuplicate =
        existingNames.some(
            (existingName) =>
                existingName
                    .trim()
                    .toLowerCase() ===
                trimmedName.toLowerCase()
        );

    const isUnchanged =
        trimmedName.toLowerCase() ===
        currentName
            .trim()
            .toLowerCase();

    const canRename =
        Boolean(trimmedName) &&
        !isDuplicate &&
        !isUnchanged;

    const handleSubmit = () => {
        if (!canRename) {
            return;
        }

        onRename(trimmedName);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <div>
                        <h2>
                            Rename Collection
                        </h2>

                        <p>
                            Change the name of
                            this collection.
                        </p>
                    </div>

                    <button
                        className="icon-button"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="form-group">
                    <label>
                        Collection Name
                    </label>

                    <input
                        value={name}
                        onChange={(
                            event
                        ) =>
                            setName(
                                event
                                    .target
                                    .value
                            )
                        }
                        onKeyDown={(
                            event
                        ) => {
                            if (
                                event.key ===
                                "Enter"
                            ) {
                                handleSubmit();
                            }
                        }}
                        autoFocus
                    />

                    {isDuplicate && (
                        <span className="form-hint">
                            A collection with
                            this name already
                            exists.
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
                            handleSubmit
                        }
                        disabled={
                            !canRename
                        }
                    >
                        Rename
                    </button>
                </div>
            </div>
        </div>
    );
}