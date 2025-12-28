import { Category } from "../categories/Category";
import { Location } from "../locations/Location";
import { Unit } from "../types/units";

export type Generic = {
    readonly id: string;
    name: string;
    category: Category;
    location: Location;
    isItentPermanent: boolean;
    readonly defaultUnit: Unit;
    readonly isDivisible: boolean;
}