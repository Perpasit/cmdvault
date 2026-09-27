export type Collection = {
    id: number;
    name: string;
    createdAt: string;
};

type SidebarProps = {
    collections: Collection[];

    selectedCollectionId:
    number | null;

    onSelectLibrary: () => void;

    onSelectCollection: (
        collection: Collection
    ) => void;

    onCreateCollection: () => void;
};

export default function Sidebar({
    collections,
    selectedCollectionId,
    onSelectLibrary,
    onSelectCollection,
    onCreateCollection,
}: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="brand">
                CmdVault
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${selectedCollectionId ===
                            null
                            ? "active"
                            : ""
                        }`}
                    onClick={
                        onSelectLibrary
                    }
                >
                    Library
                </button>
            </nav>

            <div className="sidebar-section">
                <div className="section-heading">
                    <span>
                        COLLECTIONS
                    </span>

                    <button
                        className="icon-button"
                        onClick={
                            onCreateCollection
                        }
                        aria-label="Create collection"
                        title="Create collection"
                    >
                        +
                    </button>
                </div>

                {collections.map(
                    (collection) => (
                        <button
                            className={`nav-item ${selectedCollectionId ===
                                    collection.id
                                    ? "active"
                                    : ""
                                }`}
                            key={
                                collection.id
                            }
                            onClick={() =>
                                onSelectCollection(
                                    collection
                                )
                            }
                        >
                            {collection.name}
                        </button>
                    )
                )}
            </div>

            <button className="nav-item settings">
                Settings
            </button>
        </aside>
    );
}