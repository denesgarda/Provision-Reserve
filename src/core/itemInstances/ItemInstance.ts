import { StorageState, UsageState } from "@/core/types/states";

export type ItemInstance = {
    readonly id: string;
    readonly variantId: string;
    quantityRemaining: number;
    unopenedShelfLife: number;
    openedShelfLife: number;
    spoilage: number,
    lastSpoilateUpdateTime: number;
    storageState: StorageState;
    usageState: UsageState;
}