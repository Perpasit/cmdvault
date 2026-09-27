export type Snippet = {
    id: number;
    title: string;
    tool: string;
    category: string;
    template: string;
    tags: string[];
};

export const snippets: Snippet[] = [
    {
        id: 1,
        title: "Get pods in namespace",
        tool: "Kubernetes",
        category: "Pods",
        template: "kubectl get pods -n {{namespace}}",
        tags: ["kubernetes", "pods", "troubleshooting"],
    },
    {
        id: 2,
        title: "Check pod logs",
        tool: "Kubernetes",
        category: "Logs",
        template:
            "kubectl logs {{pod_name}} -n {{namespace}} --tail={{tail_lines}}",
        tags: ["kubernetes", "logs", "troubleshooting"],
    },
    {
        id: 3,
        title: "Terraform plan with environment",
        tool: "Terraform",
        category: "Plan",
        template:
            "terraform plan -var-file=env-{{environment}}/{{environment}}.tfvars",
        tags: ["terraform", "deployment"],
    },
    {
        id: 4,
        title: "Find duplicate records",
        tool: "SQL",
        category: "Data Validation",
        template:
            "SELECT {{column}}, COUNT(*) FROM {{table}} GROUP BY {{column}} HAVING COUNT(*) > 1;",
        tags: ["sql", "validation", "database"],
    },
];