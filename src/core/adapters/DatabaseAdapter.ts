import { Database } from "../database/Database";

export interface DatabaseAdapter {
    load(): Promise<Database>;
    save(db: Database): Promise<void>;
}