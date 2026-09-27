export type Snippet = {
    id: number;
    type: "cli" | "sql";
    title: string;
    tool: string;
    environment: string;
    category: string;
    description: string;
    template: string;
    tags: string[];
    createdAt: string;
};

export const snippets: Snippet[] = [
    {
        id: 1,
        type: "cli",
        title: "Get pods in namespace",
        tool: "Kubernetes",
        environment: "Bash / Shell",
        category: "Pods",
        description: "List pods in a Kubernetes namespace.",
        template: "kubectl get pods -n {{namespace}}",
        tags: ["kubernetes", "pods", "troubleshooting"],
        createdAt: "2026-09-27T09:00:00",
    },
    {
        id: 2,
        type: "cli",
        title: "Check pod logs",
        tool: "Kubernetes",
        environment: "Bash / Shell",
        category: "Logs",
        description: "View recent logs from a Kubernetes pod.",
        template:
            "kubectl logs {{pod_name}} -n {{namespace}} --tail={{tail_lines}}",
        tags: ["kubernetes", "logs", "troubleshooting"],
        createdAt: "2026-09-27T09:05:00",
    },
    {
        id: 3,
        type: "cli",
        title: "Terraform plan with environment",
        tool: "Terraform",
        environment: "Bash / Shell",
        category: "Plan",
        description: "Run Terraform plan using an environment tfvars file.",
        template:
            "terraform plan -var-file=env-{{environment}}/{{environment}}.tfvars",
        tags: ["terraform", "deployment"],
        createdAt: "2026-09-27T09:10:00",
    },
    {
        id: 4,
        type: "sql",
        title: "Find duplicate records",
        tool: "SQL",
        environment: "SQL",
        category: "Data Validation",
        description: "Find duplicate values in a selected table column.",
        template:
            "SELECT {{column}}, COUNT(*) FROM {{table}} GROUP BY {{column}} HAVING COUNT(*) > 1;",
        tags: ["sql", "validation", "database"],
        createdAt: "2026-09-27T09:15:00",
    },
];