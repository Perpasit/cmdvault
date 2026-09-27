import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import "./App.css";

import Sidebar, {
  type Collection,
} from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import SnippetCard from "./components/SnippetCard";
import AddSnippetModal from "./components/AddSnippetModal";
import ReviewSnippet from "./components/ReviewSnippet";
import SnippetDetail from "./components/SnippetDetail";
import EditSnippet from "./components/EditSnippet";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import CreateCollectionModal from "./components/CreateCollectionModal";

import type { Snippet } from "./data/mockSnippets";
import { invoke } from "@tauri-apps/api/core";

type DraftSnippet = {
  content: string;
};

type DatabaseSnippet = {
  id: number;
  title: string;
  tool: string;
  environment: string;
  category: string;
  description: string;
  template: string;
  tags: string[];
  createdAt: string;
};

const DEFAULT_TOOL_OPTIONS = [
  "Kubernetes",
  "Terraform",
  "Azure CLI",
  "Azure PowerShell",
  "AWS CLI",
  "Docker",
  "Git",
  "SQL",
];

const DEFAULT_ENVIRONMENT_OPTIONS = [
  "Bash / Shell",
  "PowerShell",
  "Windows CMD",
  "SQL",
  "Generic CLI",
];

const DEFAULT_CATEGORY_OPTIONS: Record<
  string,
  string[]
> = {
  Kubernetes: [
    "Pods",
    "Logs",
    "Deployments",
    "Services",
    "Networking",
    "Storage",
    "Troubleshooting",
  ],

  Terraform: [
    "Plan",
    "Apply",
    "State",
    "Modules",
    "Resources",
    "Troubleshooting",
  ],

  "Azure CLI": [
    "Resources",
    "Networking",
    "Key Vault",
    "AKS",
    "Storage",
    "Identity",
  ],

  "Azure PowerShell": [
    "Resources",
    "Networking",
    "Key Vault",
    "AKS",
    "Storage",
    "Identity",
  ],

  "AWS CLI": [
    "EC2",
    "S3",
    "IAM",
    "EKS",
    "Networking",
    "CloudWatch",
  ],

  Docker: [
    "Containers",
    "Images",
    "Networks",
    "Volumes",
    "Logs",
  ],

  Git: [
    "Branch",
    "Commit",
    "Remote",
    "History",
    "Stash",
  ],

  SQL: [
    "Query",
    "Data Validation",
    "Administration",
    "Schema",
    "Troubleshooting",
  ],
};

function App() {
  const [sortBy, setSortBy] =
    useState("newest");

  const [snippetList, setSnippetList] =
    useState<Snippet[]>([]);

  const [
    collectionList,
    setCollectionList,
  ] = useState<Collection[]>([]);

  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState<Collection | null>(
    null
  );

  const [
    collectionSnippetIds,
    setCollectionSnippetIds,
  ] = useState<number[] | null>(
    null
  );

  const [
    isCreateCollectionOpen,
    setIsCreateCollectionOpen,
  ] = useState(false);

  const [isAddOpen, setIsAddOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [toolFilter, setToolFilter] =
    useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("");

  const [
    draftSnippet,
    setDraftSnippet,
  ] = useState<DraftSnippet | null>(
    null
  );

  const [
    selectedSnippet,
    setSelectedSnippet,
  ] = useState<Snippet | null>(null);

  const [
    selectedSnippetCollections,
    setSelectedSnippetCollections,
  ] = useState<Collection[]>([]);

  const [isEditing, setIsEditing] =
    useState(false);

  const [
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
  ] = useState(false);

  /*
   * Load snippets from SQLite
   */
  useEffect(() => {
    const loadSnippets = async () => {
      try {
        const databaseSnippets =
          await invoke<
            DatabaseSnippet[]
          >("get_snippets");

        const loadedSnippets:
          Snippet[] =
          databaseSnippets.map(
            (snippet) => ({
              id: snippet.id,
              title:
                snippet.title,
              tool:
                snippet.tool,
              environment:
                snippet.environment,
              category:
                snippet.category,
              description:
                snippet.description,
              template:
                snippet.template,
              tags:
                snippet.tags,
              createdAt:
                snippet.createdAt,
            })
          );

        setSnippetList(
          loadedSnippets
        );
      } catch (error) {
        console.error(
          "Failed to load snippets:",
          error
        );
      }
    };

    loadSnippets();
  }, []);

  /*
   * Load Collections from SQLite
   */
  useEffect(() => {
    const loadCollections =
      async () => {
        try {
          const databaseCollections =
            await invoke<
              Collection[]
            >(
              "get_collections"
            );

          setCollectionList(
            databaseCollections
          );
        } catch (error) {
          console.error(
            "Failed to load collections:",
            error
          );
        }
      };

    loadCollections();
  }, []);

  /*
   * Create Collection
  */
  const handleCreateCollection =
    async (name: string) => {
      const trimmedName =
        name.trim();

      if (!trimmedName) {
        return;
      }

      const createdAt =
        new Date().toISOString();

      try {
        const id =
          await invoke<number>(
            "create_collection",
            {
              input: {
                name: trimmedName,
                createdAt,
              },
            }
          );

        const newCollection:
          Collection = {
          id,
          name: trimmedName,
          createdAt,
        };

        setCollectionList(
          (current) =>
            [
              ...current,
              newCollection,
            ].sort((a, b) =>
              a.name.localeCompare(
                b.name
              )
            )
        );

        setIsCreateCollectionOpen(
          false
        );
      } catch (error) {
        console.error(
          "Failed to create collection:",
          error
        );
      }
    };

  /*
   * Select Collection
   */
  const handleSelectCollection =
    async (
      collection: Collection
    ) => {
      try {
        const snippetIds =
          await invoke<number[]>(
            "get_collection_snippet_ids",
            {
              collectionId:
                collection.id,
            }
          );

        setSelectedCollection(
          collection
        );

        setCollectionSnippetIds(
          snippetIds
        );

        setToolFilter("");
        setCategoryFilter("");
      } catch (error) {
        console.error(
          "Failed to load collection snippets:",
          error
        );
      }
    };

  /*
   * Back to Library
   */
  const handleSelectLibrary = () => {
    setSelectedCollection(null);

    setCollectionSnippetIds(null);

    setToolFilter("");
    setCategoryFilter("");
  };


  /*
   * Library Tool filter
   *
   * Only Tools that are actually
   * used by saved snippets.
   */
  const availableTools =
    useMemo(() => {
      return Array.from(
        new Set(
          snippetList
            .map((snippet) =>
              snippet.tool.trim()
            )
            .filter(Boolean)
        )
      ).sort();
    }, [snippetList]);

  /*
   * Library Category filter
   *
   * If a Tool is selected,
   * only show Categories used
   * by that Tool.
   */
  const availableCategories =
    useMemo(() => {
      return Array.from(
        new Set(
          snippetList
            .filter(
              (snippet) =>
                !toolFilter ||
                snippet.tool ===
                toolFilter
            )
            .map((snippet) =>
              snippet.category.trim()
            )
            .filter(Boolean)
        )
      ).sort();
    }, [
      snippetList,
      toolFilter,
    ]);

  /*
   * Tool options:
   *
   * Default
   * +
   * previously saved Tools
   */
  const dynamicToolOptions =
    useMemo(() => {
      return Array.from(
        new Set([
          ...DEFAULT_TOOL_OPTIONS,

          ...snippetList
            .map((snippet) =>
              snippet.tool.trim()
            )
            .filter(Boolean),
        ])
      ).sort();
    }, [snippetList]);

  /*
   * Environment options:
   *
   * Default
   * +
   * previously saved Environments
   */
  const dynamicEnvironmentOptions =
    useMemo(() => {
      return Array.from(
        new Set([
          ...DEFAULT_ENVIRONMENT_OPTIONS,

          ...snippetList
            .map((snippet) =>
              snippet.environment.trim()
            )
            .filter(Boolean),
        ])
      ).sort();
    }, [snippetList]);

  /*
   * Dynamic Category options
   */
  const getCategoryOptions =
    useCallback(
      (
        tool: string
      ): string[] => {
        const trimmedTool =
          tool.trim();

        const allSavedCategories =
          snippetList
            .map((snippet) =>
              snippet.category.trim()
            )
            .filter(Boolean);

        const allDefaultCategories =
          Object.values(
            DEFAULT_CATEGORY_OPTIONS
          ).flat();

        /*
         * No Tool selected
         */
        if (!trimmedTool) {
          return Array.from(
            new Set([
              ...allDefaultCategories,
              ...allSavedCategories,
            ])
          ).sort();
        }

        /*
         * Built-in Categories
         * for selected Tool
         */
        const defaultCategories =
          DEFAULT_CATEGORY_OPTIONS[
          trimmedTool
          ] ?? [];

        /*
         * Saved Categories
         * for selected Tool
         */
        const savedCategoriesForTool =
          snippetList
            .filter(
              (snippet) =>
                snippet.tool
                  .trim()
                  .toLowerCase() ===
                trimmedTool.toLowerCase()
            )
            .map((snippet) =>
              snippet.category.trim()
            )
            .filter(Boolean);

        return Array.from(
          new Set([
            ...defaultCategories,
            ...savedCategoriesForTool,
          ])
        ).sort();
      },
      [snippetList]
    );

  /*
   * Search + filters + sorting
   */
  const filteredSnippets =
    useMemo(() => {
      const keyword = search
        .toLowerCase()
        .trim();

      let result =
        snippetList.filter(
          (snippet) => {
            const matchesSearch =
              !keyword ||
              snippet.title
                .toLowerCase()
                .includes(
                  keyword
                ) ||
              snippet.tool
                .toLowerCase()
                .includes(
                  keyword
                ) ||
              snippet.category
                .toLowerCase()
                .includes(
                  keyword
                ) ||
              snippet.template
                .toLowerCase()
                .includes(
                  keyword
                ) ||
              snippet.tags.some(
                (tag) =>
                  tag
                    .toLowerCase()
                    .includes(
                      keyword
                    )
              );

            const matchesTool =
              !toolFilter ||
              snippet.tool ===
              toolFilter;

            const matchesCategory =
              !categoryFilter ||
              snippet.category ===
              categoryFilter;

            const matchesCollection =
              collectionSnippetIds ===
              null ||
              collectionSnippetIds.includes(
                snippet.id
              );

            return (
              matchesSearch &&
              matchesTool &&
              matchesCategory &&
              matchesCollection
            );
          }
        );

      result = [
        ...result,
      ].sort((a, b) => {
        if (
          sortBy === "oldest"
        ) {
          return (
            new Date(
              a.createdAt
            ).getTime() -
            new Date(
              b.createdAt
            ).getTime()
          );
        }

        if (
          sortBy === "name"
        ) {
          return a.title.localeCompare(
            b.title
          );
        }

        return (
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
        );
      });

      return result;
    }, [
      search,
      snippetList,
      sortBy,
      toolFilter,
      categoryFilter,
      collectionSnippetIds,
    ]);

  /*
   * Add -> Analyze
   */
  const handleAnalyze = (
    content: string
  ) => {
    setDraftSnippet({
      content,
    });

    setIsAddOpen(false);
  };

  /*
   * Create Snippet
   */
  const handleSaveSnippet =
    async (
      snippet: Omit<
        Snippet,
        "id" | "createdAt"
      >,
      collectionIds: number[]
    ) => {
      const createdAt =
        new Date().toISOString();

      try {
        const id =
          await invoke<number>(
            "create_snippet",
            {
              input: {
                title:
                  snippet.title,
                tool:
                  snippet.tool,
                environment:
                  snippet.environment,
                category:
                  snippet.category,
                description:
                  snippet.description,
                template:
                  snippet.template,
                tags:
                  snippet.tags,
                createdAt,
              },
            }
          );

        for (
          const collectionId
          of collectionIds
        ) {
          await invoke(
            "add_snippet_to_collection",
            {
              input: {
                snippetId: id,
                collectionId,
              },
            }
          );
        }

        const newSnippet:
          Snippet = {
          ...snippet,
          id,
          createdAt,
        };

        setSnippetList(
          (current) => [
            newSnippet,
            ...current,
          ]
        );

        setDraftSnippet(null);
      } catch (error) {
        console.error(
          "Failed to save snippet:",
          error
        );
      }
    };

  /*
   * Update Snippet
   */
  const handleUpdateSnippet =
    async (
      updatedSnippet: Snippet,
      collectionIds: number[]
    ) => {
      try {
        /*
         * Update snippet data
         */
        await invoke(
          "update_snippet",
          {
            input: {
              id:
                updatedSnippet.id,
              title:
                updatedSnippet.title,
              tool:
                updatedSnippet.tool,
              environment:
                updatedSnippet.environment,
              category:
                updatedSnippet.category,
              description:
                updatedSnippet.description,
              template:
                updatedSnippet.template,
              tags:
                updatedSnippet.tags,
            },
          }
        );

        /*
         * Current Collection IDs
         */
        const previousCollectionIds =
          selectedSnippetCollections.map(
            (collection) =>
              collection.id
          );

        /*
         * Collections that need
         * to be added
         */
        const collectionIdsToAdd =
          collectionIds.filter(
            (collectionId) =>
              !previousCollectionIds.includes(
                collectionId
              )
          );

        /*
         * Collections that need
         * to be removed
         */
        const collectionIdsToRemove =
          previousCollectionIds.filter(
            (collectionId) =>
              !collectionIds.includes(
                collectionId
              )
          );

        /*
         * Add new relationships
         */
        for (
          const collectionId
          of collectionIdsToAdd
        ) {
          await invoke(
            "add_snippet_to_collection",
            {
              input: {
                snippetId:
                  updatedSnippet.id,
                collectionId,
              },
            }
          );
        }

        /*
         * Remove old relationships
         */
        for (
          const collectionId
          of collectionIdsToRemove
        ) {
          await invoke(
            "remove_snippet_from_collection",
            {
              input: {
                snippetId:
                  updatedSnippet.id,
                collectionId,
              },
            }
          );
        }

        /*
         * Update frontend snippet
         */
        setSnippetList(
          (current) =>
            current.map(
              (snippet) =>
                snippet.id ===
                  updatedSnippet.id
                  ? updatedSnippet
                  : snippet
            )
        );

        /*
         * Update selected snippet
         */
        setSelectedSnippet(
          updatedSnippet
        );

        /*
         * Update Collections
         * shown in Detail
         */
        const updatedCollections =
          collectionList.filter(
            (collection) =>
              collectionIds.includes(
                collection.id
              )
          );

        setSelectedSnippetCollections(
          updatedCollections
        );

        /*
         * Keep current Collection
         * filter in sync
         */
        if (
          selectedCollection &&
          collectionSnippetIds !==
          null
        ) {
          const stillInSelectedCollection =
            collectionIds.includes(
              selectedCollection.id
            );

          setCollectionSnippetIds(
            (current) => {
              if (
                current === null
              ) {
                return null;
              }

              if (
                stillInSelectedCollection
              ) {
                return current.includes(
                  updatedSnippet.id
                )
                  ? current
                  : [
                    ...current,
                    updatedSnippet.id,
                  ];
              }

              return current.filter(
                (id) =>
                  id !==
                  updatedSnippet.id
              );
            }
          );
        }

        setIsEditing(false);
      } catch (error) {
        console.error(
          "Failed to update snippet:",
          error
        );
      }
    };

  /*
   * Delete Snippet
   */
  const handleDeleteSnippet =
    async (
      snippet: Snippet
    ) => {
      try {
        await invoke(
          "delete_snippet",
          {
            id: snippet.id,
          }
        );

        setSnippetList(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                snippet.id
            )
        );

        setIsDeleteConfirmOpen(
          false
        );

        setSelectedSnippet(null);
        setIsEditing(false);
      } catch (error) {
        console.error(
          "Failed to delete snippet:",
          error
        );
      }
    };


  /*
* Open Snippet Detail
*/
  const handleOpenSnippet =
    async (snippet: Snippet) => {
      try {
        const matchedCollections =
          await Promise.all(
            collectionList.map(
              async (
                collection
              ) => {
                const snippetIds =
                  await invoke<
                    number[]
                  >(
                    "get_collection_snippet_ids",
                    {
                      collectionId:
                        collection.id,
                    }
                  );

                return snippetIds.includes(
                  snippet.id
                )
                  ? collection
                  : null;
              }
            )
          );

        setSelectedSnippetCollections(
          matchedCollections.filter(
            (
              collection
            ): collection is Collection =>
              collection !==
              null
          )
        );

        setSelectedSnippet(
          snippet
        );
      } catch (error) {
        console.error(
          "Failed to load snippet collections:",
          error
        );

        setSelectedSnippetCollections(
          []
        );

        setSelectedSnippet(
          snippet
        );
      }
    };
  /*
   * Edit
   */
  if (
    selectedSnippet &&
    isEditing
  ) {
    return (
      <EditSnippet
        snippet={
          selectedSnippet
        }
        collections={
          collectionList
        }
        selectedCollectionIds={
          selectedSnippetCollections.map(
            (collection) =>
              collection.id
          )
        }
        onCancel={() =>
          setIsEditing(false)
        }
        onSave={
          handleUpdateSnippet
        }
        toolOptions={
          dynamicToolOptions
        }
        environmentOptions={
          dynamicEnvironmentOptions
        }
        getCategoryOptions={
          getCategoryOptions
        }
      />
    );
  }

  /*
   * Detail
   */
  if (selectedSnippet) {
    return (
      <>
        <SnippetDetail
          snippet={
            selectedSnippet
          }
          collections={
            selectedSnippetCollections
          }
          onBack={() => {
            setSelectedSnippet(
              null
            );

            setSelectedSnippetCollections(
              []
            );
          }}
          onEdit={() =>
            setIsEditing(true)
          }
          onDelete={() =>
            setIsDeleteConfirmOpen(
              true
            )
          }
        />

        {isDeleteConfirmOpen && (
          <DeleteConfirmModal
            snippetTitle={
              selectedSnippet.title
            }
            onCancel={() =>
              setIsDeleteConfirmOpen(
                false
              )
            }
            onConfirm={() =>
              handleDeleteSnippet(
                selectedSnippet
              )
            }
          />
        )}
      </>
    );
  }

  /*
   * Review
   */
  if (draftSnippet) {
    return (
      <ReviewSnippet
        content={
          draftSnippet.content
        }
        onBack={() =>
          setDraftSnippet(null)
        }
        onSave={
          handleSaveSnippet
        }
        toolOptions={
          dynamicToolOptions
        }
        environmentOptions={
          dynamicEnvironmentOptions
        }
        getCategoryOptions={
          getCategoryOptions
        }
        collections={
          collectionList
        }
      />
    );
  }

  /*
   * Library
   */
  return (
    <div className="app">
      <Sidebar
        collections={
          collectionList
        }
        selectedCollectionId={
          selectedCollection?.id ??
          null
        }
        onSelectLibrary={
          handleSelectLibrary
        }
        onSelectCollection={
          handleSelectCollection
        }
        onCreateCollection={() =>
          setIsCreateCollectionOpen(
            true
          )
        }
      />

      <main className="main">
        <header className="topbar">
          <SearchBar
            value={search}
            onChange={
              setSearch
            }
          />

          <button
            className="add-button"
            onClick={() =>
              setIsAddOpen(
                true
              )
            }
          >
            + Add Snippet
          </button>
        </header>

        <section className="library-header">
          <div>
            <h1>
              {selectedCollection
                ? selectedCollection.name
                : "Library"}
            </h1>

            <p>
              {
                filteredSnippets.length
              }{" "}
              snippets
            </p>
          </div>

          <div className="filters">
            <select
              value={
                toolFilter
              }
              onChange={(
                event
              ) => {
                setToolFilter(
                  event
                    .target
                    .value
                );

                setCategoryFilter(
                  ""
                );
              }}
            >
              <option value="">
                All Tools
              </option>

              {availableTools.map(
                (tool) => (
                  <option
                    key={
                      tool
                    }
                    value={
                      tool
                    }
                  >
                    {tool}
                  </option>
                )
              )}
            </select>

            <select
              value={
                categoryFilter
              }
              onChange={(
                event
              ) =>
                setCategoryFilter(
                  event
                    .target
                    .value
                )
              }
            >
              <option value="">
                All Categories
              </option>

              {availableCategories.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {
                      category
                    }
                  </option>
                )
              )}
            </select>

            <select
              value={sortBy}
              onChange={(
                event
              ) =>
                setSortBy(
                  event
                    .target
                    .value
                )
              }
            >
              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="name">
                Name
              </option>
            </select>
          </div>
        </section>

        <section className="snippet-list">
          {filteredSnippets.map(
            (snippet) => (
              <SnippetCard
                key={
                  snippet.id
                }
                snippet={
                  snippet
                }
                onOpen={
                  handleOpenSnippet
                }
              />
            )
          )}

          {filteredSnippets.length ===
            0 && (
              <div className="empty-state">
                No snippets found.
              </div>
            )}
        </section>
      </main>

      {isAddOpen && (
        <AddSnippetModal
          onClose={() =>
            setIsAddOpen(
              false
            )
          }
          onAnalyze={
            handleAnalyze
          }
        />
      )}

      {isCreateCollectionOpen && (
        <CreateCollectionModal
          existingNames={
            collectionList.map(
              (collection) =>
                collection.name
            )
          }
          onClose={() =>
            setIsCreateCollectionOpen(
              false
            )
          }
          onCreate={
            handleCreateCollection
          }
        />
      )}
    </div>
  );
}

export default App;