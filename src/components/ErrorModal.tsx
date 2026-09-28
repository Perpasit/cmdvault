type ErrorModalProps = {
    title: string;
    message: string;
    onClose: () => void;
};

export default function ErrorModal({
    title,
    message,
    onClose,
}: ErrorModalProps) {
    return (
        <div
            className="delete-modal-overlay"
            onClick={onClose}
        >
            <div
                className="delete-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <h2>{title}</h2>

                <p className="delete-modal-description">
                    {message}
                </p>

                <div className="delete-modal-actions">
                    <button
                        className="confirm-import-button"
                        onClick={onClose}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}