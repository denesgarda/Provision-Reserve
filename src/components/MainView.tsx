import { PageId } from "@/pages";
import { DashboardView } from "./main-views/DashboardView";
import { InventoryView } from "./main-views/InventoryView";
import { ShoppingView } from "./main-views/ShoppingView";
import { RecipesView } from "./main-views/RecipesView";
import { SettingsView } from "./main-views/SettingsView";

type MainViewProps = {
    currentPage: PageId;
}

const PAGE_VIEW_MAP: Record<PageId, React.ComponentType> = {
    dashboard: DashboardView,
    inventory: InventoryView,
    shopping: ShoppingView,
    recipes: RecipesView,
    settings: SettingsView
}

export function MainView({currentPage}: MainViewProps) {
    const ViewComponent = PAGE_VIEW_MAP[currentPage];
    return (
        <div className="main-view">
            <ViewComponent/>
        </div>
    );
}