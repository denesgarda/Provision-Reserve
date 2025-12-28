import { AppController } from "@/core/connect/AppController";
import { createContext, useContext } from "react";

type DatabaseContextType = {
    databasePath: string | undefined;
    setDatabasePath: (path: string | undefined) => void;
    appController: AppController;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error("useDatbase must be used within an AppController");
    }
    return context;
}