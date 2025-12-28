import { AppController } from "@/core/connect/AppController";
import { createContext, useContext } from "react";

type DatabaseContextType = {
    appController: AppController;
    isConnected: boolean;
    canUndo: boolean;
    canRedo: boolean;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error("useDatbase must be used within an AppController");
    }
    return context;
}