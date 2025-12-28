import { useDatabase } from "@/context/DatabaseContext"
import { useState } from "react";
import dropdownArrow from "@/assets/icons/dropdown-arrow.svg";
import { QuantityUnitPair, UnitConverter } from "@/utils/unitConversion";
import { v4 as uuidv4 } from "uuid";
import { EventType } from "@/core/event/DomainEvent";
import { Database } from "@/core/database/Database";
import { Category } from "@/core/categories/Category";
import { Location } from "@/core/locations/Location";
import { Generic } from "@/core/generics/Generic";
import { Units } from "@/core/types/units";

export function InventoryView() {
    const { appController, database } = useDatabase();
    const [ openDropdowns, setOpenDropdowns ] = useState<Set<string>>(new Set());

    return (
        <div>
        <b>{JSON.stringify(database?.generics) ?? 0} generics</b>
        <button onClick={() => {
            // Generate IDs once and store them in payload
            const categoryId = uuidv4();
            const locationId = uuidv4();
            const genericId = uuidv4();
  
            appController.execute({
              type: EventType.TEST_EVENT,
              timestamp: Date.now(),
              payload: {
                categoryId,
                locationId,
                genericId
              },
              apply: (db: Database) => {
                  const testCategory: Category = {
                    id: categoryId,
                    name: "Test Category"
                  };
  
                  const testLocation: Location = {
                    id: locationId,
                    name: "Test Location"
                  };
  
                  const testGeneric: Generic = {
                    id: genericId,
                    name: "Test Generic Item",
                    category: testCategory,
                    location: testLocation,
                    isItentPermanent: false,
                    defaultUnit: Units.COUNT,
                    isDivisible: true
                  };
  
                  return {
                    ...db,
                    generics: [...db.generics, testGeneric],
                    categories: [...db.categories, testCategory],
                    locations: [...db.locations, testLocation]
                  }
              },
              undo: (db: Database) => {
                  // Remove the specific entities by their IDs
                  return {
                    ...db,
                    generics: db.generics.filter(g => g.id !== genericId),
                    categories: db.categories.filter(c => c.id !== categoryId),
                    locations: db.locations.filter(l => l.id !== locationId)
                  };
              }
            });
          }}>
            Add generic
          </button>
            
        </div>
    )

    /*const data = databaseService?.getData();
    const generics = data?.generics;
    const variants = data?.variants;
    const itemInstances = data?.itemInstances;

    const toggleDropdown = (genericId: string) => {
        const newOpenDropdowns = new Set(openDropdowns);
        if (newOpenDropdowns.has(genericId)) {
            newOpenDropdowns.delete(genericId);
        } else {
            newOpenDropdowns.add(genericId);
        }
        setOpenDropdowns(newOpenDropdowns);
    }

    const getVariantsForGeneric = (genericId: string) => {
        const genericVariants = variants?.filter(v => v.genericId === genericId) || [];
        return genericVariants;
    }

    const getInstancesForVariant = (variantId: string) => {
        const variantInstances = itemInstances?.filter(i => i.variantId === variantId) || [];
        return variantInstances;
    }

    const getGenericInfo = (genericId: string) => {
        let items = 0;
        let quantities: QuantityUnitPair[] = [];
        for (const variant of getVariantsForGeneric(genericId)) {
            for (const instance of getInstancesForVariant(variant.id)) {
                items += 1;
                quantities.push({
                    quantity: instance.quantityRemaining,
                    unit: variant.unit
                });
            }
        }
        const defaultUnit = generics?.find(g => g.id === genericId)?.defaultUnit || "count";
        return {
            items: items,
            totalQuantity: UnitConverter.sumQuantities(quantities, defaultUnit),
            unit: defaultUnit
        };
    }

    const getVariantInfo = (variantId: string) => {
        const instances = itemInstances?.filter(i => i.variantId === variantId) || [];
        const variant = variants?.find(v => v.id === variantId);
        let openBuffer = false;
        for (const instance of instances) {
            if (variant && instance.quantityRemaining < variant.size) {
                openBuffer = true;
            }
        }
        let quantities: QuantityUnitPair[] = [];
        for (const instance of instances) {
            quantities.push({
                quantity: instance.quantityRemaining,
                unit: variant?.unit || "count"
            });
        }
        return {
            instances: instances.length,
            openBuffer: openBuffer,
            size: variant?.size,
            unit: variant?.unit,
            total: UnitConverter.sumQuantities(quantities, variant?.unit || "count")
        };
    }

    const displayVariant = (variantId: string) => {
        const variant = variants?.find(v => v.id === variantId);
        if (variant?.isPreferencePermanent) return true;
        if (getVariantInfo(variantId).total <= 0) return false;
        return true;
    }

    const displayGeneric = (genericId: string) => {
        const generic = generics?.find(g => g.id === genericId);
        if (generic?.isIntentPermanent) return true;

        const genericVariants = getVariantsForGeneric(genericId);

        const hasPreferencePermanentVariant = genericVariants.some(v => v.isPreferencePermanent);
        if (hasPreferencePermanentVariant) return true;

        let hasInStockVariant = false;
        for (const variant of genericVariants) {
            if (displayVariant(variant.id)) {
                hasInStockVariant = true;
                break;
            }
        }
        if (hasInStockVariant) return true;
        return false;
    }

    return (
        <div>
            <div className="inventory-header">
                <button className="standard-button primary">
                    Add Item
                </button>
            </div>
            {generics?.filter((generic: Generic) => displayGeneric(generic.id)).map((generic: Generic) => {
                const isOpen = openDropdowns.has(generic.id);
                const variants = getVariantsForGeneric(generic.id).filter(variant => displayVariant(variant.id));
                const genericInfo = getGenericInfo(generic.id);
                
                return (
                    <div key={generic.id} className="generic-listed">
                        <div className="generic-header" onClick={() => toggleDropdown(generic.id)}>
                            <div>
                                <p style={{
                                    fontWeight: "700"
                                }}>{generic.name}</p>
                                <p style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    color:"rgb(141, 141, 141)"
                                }}>{genericInfo.totalQuantity} {genericInfo.unit} • {genericInfo.items} items</p>
                            </div>
                            <img
                                src={dropdownArrow}
                                className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                            />
                        </div>

                        {isOpen && (
                            <div className="generic-dropdown">
                                {variants.length > 0 ? (
                                    variants.map((variant) => {
                                        const variantInfo = getVariantInfo(variant.id);

                                        return (
                                            <div key={variant.id} className="variant-listed">
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}>
                                                    <p style={{
                                                        fontWeight: "600",
                                                        marginRight: "8px"
                                                    }}>{variant?.name || 'Unknown variant'}</p>
                                                    <p style={{
                                                        fontStyle: "italic",
                                                        fontWeight: "500",
                                                        color: "rgb(75, 75, 75)",
                                                    }}>
                                                        {variantInfo.size} {variantInfo.unit}
                                                    </p>
                                                </div>
                                                <p style={{
                                                    fontSize: "15px",
                                                    fontWeight: "500",
                                                    color:"rgb(141, 141, 141)"
                                                }}>{variantInfo.openBuffer ? `${variantInfo.instances - 1} - ${variantInfo.instances}` : variantInfo.instances} left • {variantInfo.total} {variantInfo.unit} total</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="dropdown-item">
                                        <p style={{ margin: '4px 0', fontSize: '14px', color: '#9ca3af' }}>
                                            No items in inventory
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )*/
}