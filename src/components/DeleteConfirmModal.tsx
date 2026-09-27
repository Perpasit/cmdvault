type DeleteConfirmModalProps = {
    snippetTitle: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function DeleteConfirmModal({
    snippetTitle,
    onCancel,
    onConfirm,
}: DeleteConfirmModalProps) {
    return (
        <div
            className="delete-modal-overlay"
            onClick={onCancel}
        >
            <div
                className="delete-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <h2>Delete snippet?</h2>

                <p className="delete-modal-description">
                    You're about to delete
                </p>

                <div className="delete-snippet-name">
                    {snippetTitle}
                </div>

                <p className="delete-modal-warning">
                    This action cannot be undone.
                </p>

                <div className="delete-modal-actions">
                    <button
                        className="secondary-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete-button"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}