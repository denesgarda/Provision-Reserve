import { DatabaseService } from "@/services/databaseService";
import { createContext, useContext } from "react";

type DatabaseContextType = {
    databasePath: string | undefined;
    setDatabasePath: (path: string | undefined) => void;
    databaseService: DatabaseService | undefined;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error("useDatbase must be used within a DatabaseProvider");
    }
    return context;
}