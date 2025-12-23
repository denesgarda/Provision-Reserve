import { v4 as uuid } from "uuid";
import { GenericId, VariantId, ItemInstanceId  } from "@/types";

export function createGenericId(): GenericId {
    return uuid() as GenericId;
}

export function createVariantId(): GenericId {
    return uuid() as VariantId;
}

export function createItemInstanceId(): ItemInstanceId {
    return uuid() as ItemInstanceId;
}