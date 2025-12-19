import { generateId } from '../utils/id';

// Core enums for the stock system
export enum StorageState {
  FROZEN = 'frozen',
  NORMAL = 'normal'
}

export enum UsageState {
  UNOPENED = 'unopened',
  OPENED = 'opened'
}

// Unit types for measurements
export type Unit = 'gal' | 'lb' | 'oz' | 'cup' | 'tbsp' | 'tsp' | 'count' | 'dozen';

// Generic - represents surface-level food types
export interface Generic {
  readonly id: string; // immutable
  name: string;
  category?: string;
  isIntentPermanent: boolean;
  readonly defaultUnit: Unit; // immutable
  readonly isDivisible: boolean; // immutable
  location?: string;
}

// Variant - represents specific products within a generic
export interface Variant {
  readonly id: string; // immutable
  readonly genericId: string; // immutable
  readonly name: string; // immutable
  readonly size: number; // immutable (quantity amount)
  readonly unit: Unit; // immutable, must be compatible with generic's defaultUnit
  readonly defaultUnopenedShelfLife: number; // in days, immutable
  readonly defaultOpenedShelfLife: number; // in days, immutable
  readonly purchaseState: StorageState; // immutable
  isPreferencePermanent: boolean;
  upc?: string;
}

// Item Instance - physical representation of one variant
export interface ItemInstance {
  readonly id: string; // immutable
  readonly variantId: string; // immutable
  quantityRemaining: number; // must be <= variant.size
  unopenedShelfLife: number; // in days, can be adjusted
  openedShelfLife: number; // in days, can be adjusted
  spoilage: number; // 0-1, fraction of total usable shelf life consumed
  lastSpoilageUpdateTime: Date;
  storageState: StorageState; // can change between normal/frozen
  usageState: UsageState; // once opened, cannot be reverted to unopened
}

// Factory functions for creating instances with auto-generated IDs

export interface CreateGenericParams {
  name: string;
  category?: string;
  isIntentPermanent: boolean;
  defaultUnit: Unit;
  isDivisible: boolean;
  location?: string;
}

export function createGeneric(params: CreateGenericParams): Generic {
  return {
    id: generateId(),
    ...params
  };
}

export interface CreateVariantParams {
  genericId: string;
  name: string;
  size: number;
  unit: Unit;
  defaultUnopenedShelfLife: number;
  defaultOpenedShelfLife: number;
  purchaseState: StorageState;
  isPreferencePermanent?: boolean;
  upc?: string;
}

export function createVariant(params: CreateVariantParams): Variant {
  return {
    id: generateId(),
    isPreferencePermanent: false, // default value
    ...params
  };
}

export interface CreateItemInstanceParams {
  variantId: string;
  quantityRemaining?: number; // defaults to variant.size
  unopenedShelfLife?: number; // defaults to variant.defaultUnopenedShelfLife
  openedShelfLife?: number; // defaults to variant.defaultOpenedShelfLife
  storageState?: StorageState; // defaults to variant.purchaseState
}

export function createItemInstance(
  variant: Variant,
  params: CreateItemInstanceParams
): ItemInstance {
  const now = new Date();
  return {
    id: generateId(),
    variantId: params.variantId,
    quantityRemaining: params.quantityRemaining ?? variant.size,
    unopenedShelfLife: params.unopenedShelfLife ?? variant.defaultUnopenedShelfLife,
    openedShelfLife: params.openedShelfLife ?? variant.defaultOpenedShelfLife,
    spoilage: 0,
    lastSpoilageUpdateTime: now,
    storageState: params.storageState ?? variant.purchaseState,
    usageState: UsageState.UNOPENED
  };
}
