type DeleteConfirmModalProps = {
    itemType: "snippet" | "collection";
    itemName: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function DeleteConfirmModal({
    itemType,
    itemName,
    onCancel,
    onConfirm,
}: DeleteConfirmModalProps) {
    const title =
        itemType === "collection"
            ? "Delete collection?"
            : "Delete snippet?";

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
                <h2>{title}</h2>

                <p className="delete-modal-description">
                    You're about to delete
                </p>

                <div className="delete-snippet-name">
                    {itemName}
                </div>

                {itemType === "collection" ? (
                    <p className="delete-modal-warning">
                        Snippets in this collection
                        will not be deleted.
                    </p>
                ) : (
                    <p className="delete-modal-warning">
                        This action cannot be undone.
                    </p>
                )}

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