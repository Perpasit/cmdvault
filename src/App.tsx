import { useEffect, useMemo, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import SnippetCard from "./components/SnippetCard";
import AddSnippetModal from "./components/AddSnippetModal";
import ReviewSnippet from "./components/ReviewSnippet";

import type { Snippet } from "./data/mockSnippets";
import { invoke } from "@tauri-apps/api/core";

type DraftSnippet = {
  type: string;
  content: string;
};

type DatabaseSnippet = {
  id: number;
  snippetType: "cli" | "sql";
  title: string;
  tool: string;
  environment: string;
  category: string;
  description: string;
  template: string;
  tags: string[];
  createdAt: string;
};

function App() {
  const [sortBy, setSortBy] = useState("newest");
  const [snippetList, setSnippetList] = useState<Snippet[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draftSnippet, setDraftSnippet] =
    useState<DraftSnippet | null>(null);

  // Load snippets from SQLite when CmdVault starts
  useEffect(() => {
    const loadSnippets = async () => {
      try {
        const databaseSnippets =
          await invoke<DatabaseSnippet[]>("get_snippets");

        const loadedSnippets: Snippet[] =
          databaseSnippets.map((snippet) => ({
            id: snippet.id,
            type: snippet.snippetType,
            title: snippet.title,
            tool: snippet.tool,
            environment: snippet.environment,
            category: snippet.category,
            description: snippet.description,
            template: snippet.template,
            tags: snippet.tags,
            createdAt: snippet.createdAt,
          }));

        setSnippetList(loadedSnippets);
      } catch (error) {
        console.error("Failed to load snippets:", error);
      }
    };

    loadSnippets();
  }, []);

  const filteredSnippets = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    let result = snippetList.filter((snippet) => {
      if (!keyword) {
        return true;
      }

      return (
        snippet.title.toLowerCase().includes(keyword) ||
        snippet.tool.toLowerCase().includes(keyword) ||
        snippet.category.toLowerCase().includes(keyword) ||
        snippet.template.toLowerCase().includes(keyword) ||
        snippet.tags.some((tag) =>
          tag.toLowerCase().includes(keyword)
        )
      );
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return result;
  }, [search, snippetList, sortBy]);

  const handleAnalyze = (
    type: string,
    content: string
  ) => {
    setDraftSnippet({
      type,
      content,
    });

    setIsAddOpen(false);
  };

  const handleSaveSnippet = async (
    snippet: Omit<Snippet, "id" | "createdAt">
  ) => {
    const createdAt = new Date().toISOString();

    try {
      const id = await invoke<number>("create_snippet", {
        input: {
          snippetType: snippet.type,
          title: snippet.title,
          tool: snippet.tool,
          environment: snippet.environment,
          category: snippet.category,
          description: snippet.description,
          template: snippet.template,
          tags: snippet.tags,
          createdAt,
        },
      });

      const newSnippet: Snippet = {
        ...snippet,
        id,
        createdAt,
      };

      setSnippetList((current) => [
        newSnippet,
        ...current,
      ]);

      setDraftSnippet(null);
    } catch (error) {
      console.error("Failed to save snippet:", error);
    }
  };

  if (draftSnippet) {
    return (
      <ReviewSnippet
        type={draftSnippet.type}
        content={draftSnippet.content}
        onBack={() => setDraftSnippet(null)}
        onSave={handleSaveSnippet}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <header className="topbar">
          <SearchBar
            value={search}
            onChange={setSearch}
          />

          <button
            className="add-button"
            onClick={() => setIsAddOpen(true)}
          >
            + Add Snippet
          </button>
        </header>

        <section className="library-header">
          <div>
            <h1>Library</h1>
            <p>{filteredSnippets.length} snippets</p>
          </div>

          <div className="filters">
            <select defaultValue="">
              <option value="">All Tools</option>
              <option>Kubernetes</option>
              <option>Terraform</option>
              <option>SQL</option>
            </select>

            <select defaultValue="">
              <option value="">All Categories</option>
              <option>Pods</option>
              <option>Logs</option>
              <option>Plan</option>
              <option>Data Validation</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
            </select>
          </div>
        </section>

        <section className="snippet-list">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
            />
          ))}

          {filteredSnippets.length === 0 && (
            <div className="empty-state">
              No snippets found.
            </div>
          )}
        </section>
      </main>

      {isAddOpen && (
        <AddSnippetModal
          onClose={() => setIsAddOpen(false)}
          onAnalyze={handleAnalyze}
        />
      )}
    </div>
  );
}

export default App;