import "./App.css";
import { DatabaseContext } from "./context/DatabaseContext";
import { useEffect, useState } from "react";
import { AppController } from "./core/connect/AppController";
import { TopBar } from "./components/TopBar";
import { PageId } from "./pages";
import { Database } from "./core/database/Database";
import { EventType } from "./core/event/DomainEvent";
import { Generic } from "./core/generics/Generic";
import { Category } from "./core/categories/Category";
import { Location } from "./core/locations/Location";
import { Units } from "./core/types/units";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  const [appController] = useState(() => new AppController());
  const [isConnected, setIsConnected] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    appController.onStateChange = () => {
      setIsConnected(appController.isConnected);
      setCanUndo(appController.canUndo);
      setCanRedo(appController.canRedo);
    }

    setIsConnected(appController.isConnected);
    setCanUndo(appController.canUndo);
    setCanRedo(appController.canRedo);
  }, [appController]);

  return (
    <DatabaseContext.Provider value={{ appController, isConnected, canUndo, canRedo }}>
      <div className="app-root">
        <TopBar currentPage={currentPage}/>
        <button onClick={() => {
          // Generate IDs once and store them in payload
          const categoryId = uuidv4();
          const locationId = uuidv4();
          const genericId = uuidv4();

          appController.execute({
            type: EventType.TEST_EVENT,
            timestamp: Date.now(),
            payload: {
              categoryId,
              locationId,
              genericId
            },
            apply: (db: Database) => {
                const testCategory: Category = {
                  id: categoryId,
                  name: "Test Category"
                };

                const testLocation: Location = {
                  id: locationId,
                  name: "Test Location"
                };

                const testGeneric: Generic = {
                  id: genericId,
                  name: "Test Generic Item",
                  category: testCategory,
                  location: testLocation,
                  isItentPermanent: false,
                  defaultUnit: Units.COUNT,
                  isDivisible: true
                };

                return {
                  ...db,
                  generics: [...db.generics, testGeneric],
                  categories: [...db.categories, testCategory],
                  locations: [...db.locations, testLocation]
                }
            },
            undo: (db: Database) => {
                // Remove the specific entities by their IDs
                return {
                  ...db,
                  generics: db.generics.filter(g => g.id !== genericId),
                  categories: db.categories.filter(c => c.id !== categoryId),
                  locations: db.locations.filter(l => l.id !== locationId)
                };
            }
          });
        }}>
          Add generic
        </button>
      </div>
    </DatabaseContext.Provider>
  )
  /*return (
    <DatabaseContext.Provider value={{ databasePath, setDatabasePath, databaseService }}>
      <div className="app-root">
        <TopBar currentPage={currentPage}/>
        <div className="body">
          <SideBar currentPage={currentPage} onPageChange={setCurrentPage}/>
          <MainView currentPage={currentPage}/>
        </div>
      </div>
    </DatabaseContext.Provider>
  );*/
}