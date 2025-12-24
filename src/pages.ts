export type PageId = 
    | "dashboard"
    | "inventory"
    | "shopping"
    | "recipes"
    | "settings"

export type PageDefinition = {
    id: PageId;
    label: string;
    icon: string;
}

export const PAGES: PageDefinition[] = [
    { id: "dashboard", label: "Dashboard", icon: "./assets/icons/dashboard.png" },
    { id: "inventory", label: "Inventory", icon: "./assets/icons/inventory.png" },
    { id: "shopping", label: "Shopping", icon: "./assets/icons/shopping.png" },
    { id: "recipes", label: "Recipes", icon: "./assets/icons/recipes.png" },
    { id: "settings", label: "Settings", icon: "./assets/icons/settings.png" },
]

export function getPageById(id: PageId): PageDefinition {
    const page = PAGES.find(p => p.id === id);
    if (!page) {
        throw new Error(`Unknown page ID: ${id}`);
    }
    return page;
}