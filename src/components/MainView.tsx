import { PageId } from "@/pages";
import { DashboardView } from "./main-views/DashboardView";
import { InventoryView } from "./main-views/InventoryView";
import { ShoppingView } from "./main-views/ShoppingView";
import { RecipesView } from "./main-views/RecipesView";
import { SettingsView } from "./main-views/SettingsView";
import { useDatabase } from "@/context/DatabaseContext";

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
    const isConnected = useDatabase().isConnected;
    const ViewComponent = PAGE_VIEW_MAP[currentPage];
    if (!isConnected) {
        return (
            <div className="main-view">
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '80%',
                    flexDirection: 'column',
                    textAlign: 'center',
                    padding: '2rem',
                    color:'rgb(193, 193, 193)'
                }}>
                    <h2>Database Connection Required</h2>
                    <p>Please connect to a database to access this application.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="main-view">
            <ViewComponent/>
        </div>
    );
}