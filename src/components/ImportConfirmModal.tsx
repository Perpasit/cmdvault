type ImportConfirmModalProps = {
    snippetCount: number;
    collectionCount: number;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function ImportConfirmModal({
    snippetCount,
    collectionCount,
    onCancel,
    onConfirm,
}: ImportConfirmModalProps) {
    return (
        <div
            className="delete-modal-overlay"
            onClick={onCancel}
        >
            <div
                className="delete-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <h2>Import backup?</h2>

                <p className="delete-modal-description">
                    This backup contains
                </p>

                <div className="import-backup-summary">
                    <div>
                        <strong>{snippetCount}</strong>
                        <span> snippets</span>
                    </div>

                    <div>
                        <strong>{collectionCount}</strong>
                        <span> collections</span>
                    </div>
                </div>

                <p className="delete-modal-warning">
                    Existing data will be kept.
                    Duplicate snippets will be skipped.
                </p>

                <div className="delete-modal-actions">
                    <button
                        className="secondary-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-import-button"
                        onClick={onConfirm}
                    >
                        Import
                    </button>
                </div>
            </div>
        </div>
    );
}