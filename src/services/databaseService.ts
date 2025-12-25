import { Generic, ItemInstance, Variant } from "@/types";
import { Database } from "@/types/database";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

export class DatabaseService {
    private databasePath: string | undefined;
    private data: Database | undefined;

    constructor(databasePath?: string) {
        this.databasePath = databasePath;
    }

    async setDatabasePath(path: string): Promise<void> {
        this.databasePath = path;
        await this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<void> {
        if (!this.databasePath) {
            throw new Error("Database path not set");
        }
    
        try {
            // Try to read the file - if it exists, this will work
            const content = await readTextFile(this.databasePath, { baseDir: BaseDirectory.Home });
            this.data = JSON.parse(content);
        } catch (error) {
            // File doesn't exist or can't be read, create it
            const initialData: Database = {
                generics: [],
                variants: [],
                itemInstances: []
            };
            await writeTextFile(this.databasePath, JSON.stringify(initialData, null, 2), { baseDir: BaseDirectory.Home });
            this.data = initialData;
        }
    }

    private async loadData(): Promise<void> {
        if (!this.databasePath) {
            throw new Error("Database path not set");
        }
    
        const content = await readTextFile(this.databasePath, { baseDir: BaseDirectory.Home });
        this.data = JSON.parse(content);
    }
    
    private async saveData(): Promise<void> {
        if (!this.databasePath || !this.data) {
            throw new Error("Database path not set or no data to save");
        }
    
        await writeTextFile(this.databasePath, JSON.stringify(this.data, null, 2), { baseDir: BaseDirectory.Home });
    }

    getData(): Database {
        if (!this.data) {
            throw new Error("Database not initialized");
        }
        return this.data;
    }

    // Generic CRUD operations
    async addGeneric(generic: Generic): Promise<void> {
        if (!this.data) throw new Error("Database not initialized");
        this.data.generics.push(generic);
        await this.saveData();
    }

    async updateGeneric(generic: Generic): Promise<void> {
        if (!this.data) throw new Error("Database not initialized");
        const index = this.data.generics.findIndex(g => g.id === generic.id);
        if (index === -1) throw new Error("Generic not found");
        this.data.generics[index] = generic;
        await this.saveData();
    }

    async deleteGeneric(id: string): Promise<void> {
        if (!this.data) throw new Error("Database not initialized");
        this.data.generics = this.data.generics.filter(g => g.id !== id);
        await this.saveData();
    }

    // Variant CRUD operations
    async addVariant(variant: Variant): Promise<void> {
        if (!this.data) throw new Error("Database not initialized");
        this.data.variants.push(variant);
        await this.saveData();
    }

    async updateVariant(variant: Variant): Promise<void> {
        if (!this.data) throw new Error("Database not initialized");
        const index = this.data.variants.findIndex(v => v.id === variant.id);
        if (index === -1) throw new Error("Variant not found");
        this.data.variants[index] = variant;
        await this.saveData();
    }

    async deleteVariant(id: string): Promise<void> {
        if (!this.data) throw new Error("Database not initialized");
        this.data.variants = this.data.variants.filter(v => v.id !== id);
        await this.saveData();
    }

    // ItemInstance CRUD operations
    async addItemInstance(itemInstance: ItemInstance): Promise<void> {
        if (!this.data) throw new Error("Database not initialized");
        this.data.itemInstances.push(itemInstance);
        await this.saveData();
    }

    async updateItemInstance(itemInstance: ItemInstance): Promise<void> {
        if (!this.data) throw new Error("Database not initialized");
        const index = this.data.itemInstances.findIndex(i => i.id === itemInstance.id);
        if (index === -1) throw new Error("ItemInstance not found");
        this.data.itemInstances[index] = itemInstance;
        await this.saveData();
    }

    async deleteItemInstance(id: string): Promise<void> {
        if (!this.data) throw new Error("Database not initialized");
        this.data.itemInstances = this.data.itemInstances.filter(i => i.id !== id);
        await this.saveData();
    }
}