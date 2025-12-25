import { useDatabase } from "@/context/DatabaseContext"
import { Generic } from "@/types";
import { useState } from "react";
import dropdownArrow from "@/assets/icons/dropdown-arrow.svg";

export function InventoryView() {
    const databaseService = useDatabase().databaseService;
    const [ openDropdowns, setOpenDropdowns ] = useState<Set<string>>(new Set());

    const data = databaseService?.getData();
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

    const getVariantInfo = (variantId: string) => {
        const instances = itemInstances?.filter(i => i.variantId === variantId) || [];
        return {
            instances: instances.length
        };
    }
    return (
        <div>
            {generics?.map((generic: Generic) => {
                const isOpen = openDropdowns.has(generic.id);
                const variants = getVariantsForGeneric(generic.id);
                
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
                                }}>2 gal • 2 items</p>
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
                                                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                                                    {variant?.name || 'Unknown variant'}
                                                </p>
                                                <p>
                                                    {variantInfo.instances} ct.
                                                </p>
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
    )
}