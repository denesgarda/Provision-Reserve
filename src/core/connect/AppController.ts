import { DatabaseAdapter } from "../adapters/DatabaseAdapter";
import { Database } from "../database/Database";
import { DomainEvent } from "../event/DomainEvent";
import { JSONFileStore } from "./JSONFileStore";

export class AppController {
    adapter: DatabaseAdapter | undefined;
    eventCache: DomainEvent[];
    cursor: number;
    onStateChange?: () => void;

    constructor() {
        this.adapter = undefined;
        this.eventCache = [];
        this.cursor = -1;
    }

    connect(path: string) {
        this.adapter = new JSONFileStore(path);
        this.eventCache = [];
        this.cursor = -1;
        this.onStateChange?.();
    }

    disconnect() {
        this.adapter = undefined;
        this.eventCache = [];
        this.cursor = -1;
        this.onStateChange?.();
    }

    async getDatabase(): Promise<Database> {
        if (this.adapter === undefined) {
            throw new Error("Database not connected");
        }
        return await this.adapter.load();
    }

    get isConnected(): boolean { 
        return this.adapter !== undefined; 
    }

    get canUndo(): boolean {
        return this.adapter !== undefined && this.cursor >= 0;
    }

    get canRedo(): boolean {
        return this.adapter !== undefined && this.cursor + 1 < this.eventCache.length;
    }

    async execute(event: DomainEvent) {
        if (this.adapter === undefined) {
            throw new Error("Cannot execute event with no database present.");
        } else {
            const db = await this.adapter.load();
            const updated = event.apply(db);
            await this.adapter.save(updated);
            this.eventCache.splice(this.cursor + 1);
            this.eventCache.push(event);
            this.cursor++;
            this.onStateChange?.();
        }
    }

    async undo() {
        if (this.adapter === undefined) {
            throw new Error("Cannot undo with no database present.");
        } else {
            const db = await this.adapter.load();
            const updated = this.eventCache[this.cursor].undo(db);
            await this.adapter.save(updated);
            this.cursor--;
            this.onStateChange?.();
        }
    }

    async redo() {
        if (this.adapter === undefined) {
            throw new Error("Cannot undo with no database present.");
        } else {
            const db = await this.adapter.load();
            const updated = this.eventCache[this.cursor + 1].apply(db);
            await this.adapter.save(updated);
            this.cursor++;
            this.onStateChange?.();
        }
    }
}