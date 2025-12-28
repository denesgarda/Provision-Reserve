import { Generic } from "../generics/Generic";
import { Category } from "../categories/Category";
import { Location } from "../locations/Location";
import { Variant } from "../variants/Variant";
import { ItemInstance } from "../itemInstances/ItemInstance";

export type Database = {
    generics: Generic[];
    variants: Variant[];
    itemInstances: ItemInstance[];
    locations: Location[];
    categories: Category[];
}