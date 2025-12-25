import { Generic } from "./generic"
import { ItemInstance } from "./item-instance";
import { Variant } from "./variant";

export type Database = {
    generics: Generic[];
    variants: Variant[];
    itemInstances: ItemInstance[];
}