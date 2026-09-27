import {
    useState,
} from "react";

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

    onRenameCollection: (
        collection: Collection
    ) => void;

    onDeleteCollection: (
        collection: Collection
    ) => void;
};

export default function Sidebar({
    collections,
    selectedCollectionId,
    onSelectLibrary,
    onSelectCollection,
    onCreateCollection,
    onRenameCollection,
    onDeleteCollection,
}: SidebarProps) {
    const [
        openMenuId,
        setOpenMenuId,
    ] = useState<number | null>(
        null
    );

    const toggleMenu = (
        collectionId: number
    ) => {
        setOpenMenuId(
            (current) =>
                current === collectionId
                    ? null
                    : collectionId
        );
    };

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
                        <div
                            className="collection-nav-row"
                            key={
                                collection.id
                            }
                        >
                            <button
                                className={`nav-item collection-nav-button ${selectedCollectionId ===
                                        collection.id
                                        ? "active"
                                        : ""
                                    }`}
                                onClick={() => {
                                    setOpenMenuId(
                                        null
                                    );

                                    onSelectCollection(
                                        collection
                                    );
                                }}
                            >
                                <span className="collection-nav-name">
                                    {
                                        collection.name
                                    }
                                </span>
                            </button>

                            <div className="collection-menu-wrapper">
                                <button
                                    className="collection-menu-button"
                                    onClick={(
                                        event
                                    ) => {
                                        event.stopPropagation();

                                        toggleMenu(
                                            collection.id
                                        );
                                    }}
                                    aria-label={`Actions for ${collection.name}`}
                                    title="Collection actions"
                                >
                                    ···
                                </button>

                                {openMenuId ===
                                    collection.id && (
                                        <div className="collection-menu">
                                            <button
                                                onClick={() => {
                                                    setOpenMenuId(
                                                        null
                                                    );

                                                    onRenameCollection(
                                                        collection
                                                    );
                                                }}
                                            >
                                                Rename
                                            </button>

                                            <button
                                                className="danger"
                                                onClick={() => {
                                                    setOpenMenuId(
                                                        null
                                                    );

                                                    onDeleteCollection(
                                                        collection
                                                    );
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )
                )}
            </div>

            <button className="nav-item settings">
                Settings
            </button>
        </aside>
    );
}