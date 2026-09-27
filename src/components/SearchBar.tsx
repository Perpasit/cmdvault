type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({
    value,
    onChange,
}: SearchBarProps) {
    return (
        <input
            className="search-input"
            type="search"
            placeholder="Search commands, queries, tags..."
            value={value}
            onChange={(event) => onChange(event.target.value)}
        />
    );
}