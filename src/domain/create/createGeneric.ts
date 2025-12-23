import { Generic, Unit } from "@/types";
import { createGenericId } from "../ids";

export function createGeneric(input: {
    name: string,
    category: string;
    isIntentPermanent: boolean;
    defaultUnit: Unit;
    isDivisible: boolean;
    location: string;
}): Generic {
    return {
        id: createGenericId(),
        name: input.name,
        category: input.category,
        isIntentPermanent: input.isIntentPermanent,
        defaultUnit: input.defaultUnit,
        isDivisible: input.isDivisible,
        location: input.location
    }
}