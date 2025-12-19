import { generateId } from '../utils/id';

// Base event source enum
export enum EventSource {
  USER = 'user',
  SYSTEM = 'system',
  AUTOMATION = 'automation'
}

// Base Event interface - all events share this envelope
export interface Event {
  readonly id: string;
  readonly type: string;
  readonly timestamp: Date;
  readonly source: EventSource;
  readonly metadata?: Record<string, any>;
}

// Event categories
export interface InventoryEvent extends Event {
  readonly type: 'inventory';
  readonly subType: InventoryEventType;
}

export interface StateTransitionEvent extends Event {
  readonly type: 'state_transition';
  readonly subType: StateTransitionEventType;
}

export interface MealSystemEvent extends Event {
  readonly type: 'meal_system';
  readonly subType: MealSystemEventType;
}

export interface ShoppingSystemEvent extends Event {
  readonly type: 'shopping_system';
  readonly subType: ShoppingSystemEventType;
}

// Event type enums
export enum InventoryEventType {
  ITEM_ADDED = 'item_added',
  ITEM_USED = 'item_used',
  ITEM_DISCARDED = 'item_discarded',
  ITEM_REMOVED = 'item_removed'
}

export enum StateTransitionEventType {
  USAGE_STATE_CHANGED = 'usage_state_changed',
  STORAGE_STATE_CHANGED = 'storage_state_changed',
  SHELF_LIFE_ADJUSTED = 'shelf_life_adjusted',
  SPOILAGE_ACCOUNTING = 'spoilage_accounting',
  SPOILAGE_CHECKPOINT = 'spoilage_checkpoint'
}

export enum MealSystemEventType {
  MEAL_COOKED = 'meal_cooked',
  MEAL_DETACHED = 'meal_detached',
  MEAL_PLANNED = 'meal_planned',
  MEAL_EDITED = 'meal_edited'
}

export enum ShoppingSystemEventType {
  MANUAL_SHOPPING_LIST_ENTRY_ADDED = 'manual_shopping_list_entry_added',
  MANUAL_SHOPPING_LIST_ENTRY_REMOVED = 'manual_shopping_list_entry_removed',
  RESTOCK_POLICY_TRIGGERED = 'restock_policy_triggered',
  LOW_STOCK_THRESHOLD_UPDATED = 'low_stock_threshold_updated',
  RESTOCK_POLICY_UPDATED = 'restock_policy_updated'
}

// Union type for all possible events
export type AnyEvent =
  | InventoryEvent
  | StateTransitionEvent
  | MealSystemEvent
  | ShoppingSystemEvent;

// Factory functions for creating events (placeholders for now)
export interface CreateEventParams {
  type: string;
  source: EventSource;
  metadata?: Record<string, any>;
}

export function createEvent(params: CreateEventParams): Event {
  return {
    id: generateId(),
    timestamp: new Date(),
    ...params
  };
}

// Placeholder factory functions for specific event types
// These will be implemented when the corresponding features are added

export function createInventoryEvent(
  subType: InventoryEventType,
  source: EventSource,
  metadata?: Record<string, any>
): InventoryEvent {
  return {
    ...createEvent({ type: 'inventory', source, metadata }),
    subType
  } as InventoryEvent;
}

export function createStateTransitionEvent(
  subType: StateTransitionEventType,
  source: EventSource,
  metadata?: Record<string, any>
): StateTransitionEvent {
  return {
    ...createEvent({ type: 'state_transition', source, metadata }),
    subType
  } as StateTransitionEvent;
}

export function createMealSystemEvent(
  subType: MealSystemEventType,
  source: EventSource,
  metadata?: Record<string, any>
): MealSystemEvent {
  return {
    ...createEvent({ type: 'meal_system', source, metadata }),
    subType
  } as MealSystemEvent;
}

export function createShoppingSystemEvent(
  subType: ShoppingSystemEventType,
  source: EventSource,
  metadata?: Record<string, any>
): ShoppingSystemEvent {
  return {
    ...createEvent({ type: 'shopping_system', source, metadata }),
    subType
  } as ShoppingSystemEvent;
}
