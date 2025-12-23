export const Units = {
  COUNT: "count",

  // Volume (US customary)
  TEASPOON: "tsp",
  TABLESPOON: "tbsp",
  FLUID_OUNCE: "fl oz",
  CUP: "cup",
  PINT: "pt",
  QUART: "qt",
  GALLON: "gal",

  // Volume (Metric)
  MILLILITER: "mL",
  CENTILITER: "cL",
  DECILITER: "dL",
  LITER: "L",

  // Weight/Mass
  MICROGRAM: "mcg",
  MILLIGRAM: "mg",
  GRAM: "g",
  KILOGRAM: "kg",
  OUNCE: "oz",
  POUND: "lb",

  // International/Imperial units
  IMPERIAL_FLUID_OUNCE: "imp fl oz",
  IMPERIAL_PINT: "imp pt",
  IMPERIAL_QUART: "imp qt",
  IMPERIAL_GALLON: "imp gal",

  // To allow for egg(s) or similar
  DOZEN: "dozen"
} as const;

export type Unit = (typeof Units)[keyof typeof Units];