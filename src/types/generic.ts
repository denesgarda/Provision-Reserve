import { Unit } from "./units";
import { GenericId } from "./ids";

export type Generic = {
    readonly id: GenericId;
    name: string;
    category: string;
    isIntentPermanent: boolean;
    readonly defaultUnit: Unit;
    readonly isDivisible: boolean;
    location: string;
}