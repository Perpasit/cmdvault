import type { Snippet } from "../data/mockSnippets";

type SnippetCardProps = {
    snippet: Snippet;
    onOpen: (snippet: Snippet) => void;
};

export default function SnippetCard({
    snippet,
    onOpen,
}: SnippetCardProps) {
    const copySnippet = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();

        await navigator.clipboard.writeText(snippet.template);
    };

    return (
        <article
            className="snippet-card"
            onClick={() => onOpen(snippet)}
        >
            <div className="snippet-header">
                <div>
                    <h3>{snippet.title}</h3>

                    <p className="snippet-meta">
                        {snippet.tool} · {snippet.category}
                    </p>
                </div>

                <button
                    className="copy-button"
                    onClick={copySnippet}
                >
                    Copy
                </button>
            </div>

            <pre className="snippet-code">
                <code>{snippet.template}</code>
            </pre>

            <div className="tags">
                {snippet.tags.map((tag) => (
                    <span
                        className="tag"
                        key={tag}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </article>
    );
}