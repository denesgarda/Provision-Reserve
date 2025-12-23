export const StorageState = {
    NORMAL: "normal",
    FROZEN: "frozen"
} as const;

export const UsageState = {
    UNOPENED: "unopened",
    OPENED: "opened"
} as const;

export type StorageState = (typeof StorageState)[keyof typeof StorageState];
export type UsageState = (typeof UsageState)[keyof typeof UsageState];