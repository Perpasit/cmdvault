type ImportResultModalProps = {
    importedSnippets: number;
    skippedSnippets: number;
    createdCollections: number;
    reusedCollections: number;
    onClose: () => void;
};

export default function ImportResultModal({
    importedSnippets,
    skippedSnippets,
    createdCollections,
    reusedCollections,
    onClose,
}: ImportResultModalProps) {
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
                <h2>Import completed</h2>

                <p className="delete-modal-description">
                    Your backup was imported successfully.
                </p>

                <div className="import-result-summary">
                    <div>
                        <span>Imported snippets</span>
                        <strong>{importedSnippets}</strong>
                    </div>

                    <div>
                        <span>Skipped duplicates</span>
                        <strong>{skippedSnippets}</strong>
                    </div>

                    <div>
                        <span>Created collections</span>
                        <strong>{createdCollections}</strong>
                    </div>

                    <div>
                        <span>Reused collections</span>
                        <strong>{reusedCollections}</strong>
                    </div>
                </div>

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