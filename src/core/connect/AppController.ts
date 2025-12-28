import { DatabaseAdapter } from "../adapters/DatabaseAdapter";
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

    setPath(path: string) {
        this.adapter = new JSONFileStore(path);
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
            this.adapter.save(updated);
            this.eventCache.splice(this.cursor + 1);
            this.eventCache.push(event);
            this.cursor++;
        }
    }

    async undo() {
        if (this.adapter === undefined) {
            throw new Error("Cannot undo with no database present.");
        } else {
            const db = await this.adapter.load();
            const updated = this.eventCache[this.cursor].undo(db);
            this.adapter.save(updated);
            this.cursor--;
        }
    }

    async redo() {
        if (this.adapter === undefined) {
            throw new Error("Cannot undo with no database present.");
        } else {
            const db = await this.adapter.load();
            const updated = this.eventCache[this.cursor + 1].apply(db);
            this.adapter.save(updated);
            this.cursor++;
        }
    }
}