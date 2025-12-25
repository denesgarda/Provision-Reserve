import { useDatabase } from "@/context/DatabaseContext"
import { Generic } from "@/types";

export function InventoryView() {
    const databaseService = useDatabase().databaseService;

    const generics = databaseService?.getData().generics;

    return (
        <div>
            {generics?.map((generic: Generic) => (
                <div key={generic.id} className="generic-listed">
                    <p style={{
                        fontWeight: "700"
                    }}>{generic.name}</p>
                    <p style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        color:"rgb(141, 141, 141)"
                    }}>2 gal • 2 items</p>
                </div>
            ))}
        </div>
    )
}