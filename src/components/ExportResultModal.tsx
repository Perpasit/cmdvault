type ExportResultModalProps = {
    onClose: () => void;
};

export default function ExportResultModal({
    onClose,
}: ExportResultModalProps) {
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
                <h2>Export completed</h2>

                <p className="delete-modal-description">
                    Your CmdVault backup was saved successfully.
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