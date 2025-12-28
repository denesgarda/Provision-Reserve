import { Database } from "../database/Database";

export interface DomainEvent<TPayload = unknown> {
    readonly type: EventType;
    readonly timestamp: number;
    readonly payload: TPayload;

    apply(db: Database): Database;
    undo(db: Database): Database;
}

export const EventType = {
    TEST_EVENT: "TEST_EVENT"
}

export type EventType = (typeof EventType)[keyof typeof EventType];