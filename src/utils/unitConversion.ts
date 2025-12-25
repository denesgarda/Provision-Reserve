import { Unit, Units } from "@/types";

const BASE_UNTIS = {
    COUNT: Units.COUNT,
    VOLUME: Units.LITER,
    WEIGHT: Units.GRAM,
}

const CONVERSION_FACTORS: Record<Unit, number> = {
    [Units.COUNT]: 1,
    [Units.DOZEN]: 12,

    [Units.TEASPOON]: 0.00492892,
    [Units.TABLESPOON]: 0.0147868,
    [Units.FLUID_OUNCE]: 0.0295735,
    [Units.CUP]: 0.24,
    [Units.PINT]: 0.473176,
    [Units.QUART]: 0.946353,
    [Units.GALLON]: 3.78541,
    [Units.MILLILITER]: 0.001,
    [Units.CENTILITER]: 0.01,
    [Units.DECILITER]: 0.1,
    [Units.LITER]: 1,
    [Units.IMPERIAL_FLUID_OUNCE]: 0.0284131,
    [Units.IMPERIAL_PINT]: 0.568261,
    [Units.IMPERIAL_QUART]: 1.13652,
    [Units.IMPERIAL_GALLON]: 4.54609,

    [Units.MICROGRAM]: 0.000001,
    [Units.MILLIGRAM]: 0.001,
    [Units.DECAGRAM]: 0.01,
    [Units.GRAM]: 1,
    [Units.KILOGRAM]: 1000,
    [Units.OUNCE]: 28.3495,
    [Units.POUND]: 453.592
};

const UNIT_CATEGORIES: Record<string, Unit[]> = {
    COUNT: [Units.COUNT, Units.DOZEN],
    VOLUME: [Units.TEASPOON, Units.TABLESPOON, Units.FLUID_OUNCE, Units.CUP, Units.PINT, Units.QUART, Units.GALLON, Units.MILLILITER, Units.DECILITER, Units.CENTILITER, Units.LITER, Units.IMPERIAL_FLUID_OUNCE, Units.IMPERIAL_PINT, Units.IMPERIAL_QUART, Units.IMPERIAL_GALLON],
    WEIGHT: [Units.MICROGRAM, Units.MILLIGRAM, Units.DECAGRAM, Units.GRAM, Units.KILOGRAM, Units.OUNCE, Units.POUND]
};

export type QuantityUnitPair = {
    quantity: number;
    unit: Unit;
}

export class UnitConverter {
    static areCompatible(unit1: Unit, unit2: Unit): boolean {
        if (unit1 === unit2) return true;

        for (const category of Object.values(UNIT_CATEGORIES)) {
            if (category.includes(unit1) && category.includes(unit2)) return true;
        }

        return false;
    }

    static convert(quantity: number, fromUnit: Unit, toUnit: Unit): number {
        if (fromUnit === toUnit) return quantity;

        if (!this.areCompatible(fromUnit, toUnit)) {
            throw new Error(`Cannot convert between incompatible units: ${fromUnit} and ${toUnit}`);
        }

        const baseValue = quantity * CONVERSION_FACTORS[fromUnit];
        return baseValue / CONVERSION_FACTORS[toUnit];
    }

    static sumQuantities(quantities: QuantityUnitPair[], targetUnit: Unit): number {
        if (quantities.length === 0) return 0;

        for (const { unit } of quantities) {
            if (!this.areCompatible(unit, targetUnit)) {
                throw new Error(`Cannot convert unit ${unit} to ${targetUnit} - incompatible units`);
            }
        }

        return quantities.reduce((total, { quantity, unit }) => {
            return total + this.convert(quantity, unit, targetUnit);
        }, 0);
    }
}