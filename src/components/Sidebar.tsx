const tools = [
    ["Kubernetes", 2],
    ["Terraform", 1],
    ["SQL", 1],
];

const collections = [
    "AKS Troubleshooting",
    "Daily Commands",
    "Data Validation",
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">CmdVault</div>

            <nav className="sidebar-nav">
                <button className="nav-item active">Library</button>
            </nav>

            <div className="sidebar-section">
                <div className="section-heading">
                    <span>COLLECTIONS</span>
                    <button className="icon-button">+</button>
                </div>

                {collections.map((collection) => (
                    <button className="nav-item" key={collection}>
                        {collection}
                    </button>
                ))}
            </div>

            {/* <div className="sidebar-section">
                <div className="section-heading">
                    <span>TOOLS</span>
                </div>

                {tools.map(([tool, count]) => (
                    <button className="nav-item nav-row" key={tool}>
                        <span>{tool}</span>
                        <span className="count">{count}</span>
                    </button>
                ))}
            </div> */}

            <button className="nav-item settings">Settings</button>
        </aside>
    );
}