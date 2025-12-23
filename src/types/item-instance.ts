import { ItemInstanceId, VariantId } from "./ids"
import { StorageState, UsageState } from "./states";

export type ItemInstance = {
    readonly id: ItemInstanceId;
    readonly variantId: VariantId;
    quantityRemaining: number;
    unopenedShelfLife: number;
    openedShelfLife: number;
    spoilage: number;
    lastSpoilageUpdateTime: number;
    storageState: StorageState;
    usageState: UsageState;
}