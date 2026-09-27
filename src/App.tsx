import { useMemo, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import SnippetCard from "./components/SnippetCard";
import { snippets } from "./data/mockSnippets";
import AddSnippetModal from "./components/AddSnippetModal";
import ReviewSnippet from "./components/ReviewSnippet";

type DraftSnippet = {
  type: string;
  content: string;
};

function App() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSnippets = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return snippets;
    }

    return snippets.filter((snippet) => {
      return (
        snippet.title.toLowerCase().includes(keyword) ||
        snippet.tool.toLowerCase().includes(keyword) ||
        snippet.category.toLowerCase().includes(keyword) ||
        snippet.template.toLowerCase().includes(keyword) ||
        snippet.tags.some((tag) =>
          tag.toLowerCase().includes(keyword),
        )
      );
    });
  }, [search]);

  const handleAnalyze = (type: string, content: string) => {
    setDraftSnippet({
      type,
      content,
    });

    setIsAddOpen(false);
  };

  const handleSaveSnippet = () => {
    console.log("Save snippet");
    setDraftSnippet(null);
  };

  const [draftSnippet, setDraftSnippet] =
    useState<DraftSnippet | null>(null);

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
          <SearchBar value={search} onChange={setSearch} />

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

            <select defaultValue="newest">
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