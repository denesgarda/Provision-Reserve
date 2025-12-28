import { Database } from "../database/Database";
import { DatabaseAdapter } from "../adapters/DatabaseAdapter";
import { readTextFile, BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";

export class JSONFileStore implements DatabaseAdapter {
    path: string;

    constructor(path: string) {
        this.path = path;
    }
    
    async load(): Promise<Database> {
        await this.verify();
        const content = await readTextFile(this.path, { baseDir: BaseDirectory.Home });
        return JSON.parse(content);
    }

    async save(db: Database): Promise<void> {
        await this.verify();
        await writeTextFile(this.path, JSON.stringify(db, null, 2), { baseDir: BaseDirectory.Home });
    }

    private async verify(): Promise<void> {
        if (!this.path) {
            throw new Error ("Database path not set");
        }
        try {
            await readTextFile(this.path, { baseDir: BaseDirectory.Home });
        } catch (error) {
            const initialData: Database = {
                generics: [],
                variants: [],
                itemInstances: [],
                locations: [],
                categories: []
            };
            await writeTextFile(this.path, JSON.stringify(initialData, null, 2), { baseDir: BaseDirectory.Home });
        }
    }
}