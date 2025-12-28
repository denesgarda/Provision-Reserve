import { StorageState } from "../types/states";
import { Unit } from "../types/units";

export type Variant = {
    readonly id: string;
    readonly genericId: string;
    readonly name: string;
    readonly size: number;
    readonly unit: Unit;
    readonly defaultUnopenedShelfLife: number;
    readonly defaultOpenedShelfLife: number;
    readonly purchaseState: StorageState;
    isPreferencePermanent: boolean;
}