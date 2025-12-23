import { Unit } from "./units";
import { VariantId } from "./ids";
import { GenericId } from "./ids";
import { StorageState } from "./states";

export type Variant = {
    readonly id: VariantId;
    readonly genericId: GenericId;
    readonly name: string;
    readonly size: number;
    readonly unit: Unit;
    readonly defaultUnopenedShelfLife: number;
    readonly defaultOpenedShelfLife: number;
    readonly purchaseState: StorageState;
    isPreferencePermanent: boolean;
    upc?: string;
}