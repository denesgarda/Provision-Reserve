# Provision Reserve

\* represents an immutable data field.

## The Building Blocks of Inventory

### Generic

The generic object represents any surface-level food type that actual items may share, such as

- Low fat milk
- Apple
- Eggs
- Chicken breast

==Geneirics would be something that would appear on a **recipe** or **grocery list**.==

```
Generic
- id*
- name
- category
- isIntentPermanent
- defaultUnit*
- isDivisible*
- Location
```

### Variant

The variant object represents a food type within a [generic](#Generic), such as

- Lucerne 2% Low Fat Milk, 1 gal
- Apple
- Large eggs, dozen
- Chicken breast

A generic can either plainly be a **wrapper** for an identical variant, as is the case for apple and chicken breast, or it can be a super-category that encompasses different variants. A variant whose generic is a wrapper is called an **implicit variant**. ==Variants would be a <u>type</u> of item you would buy at a store.==

```
Variant
- id*
- genericId*
- name*
- size*
- unit*
- defaultUnopenedShelfLife*
- defaultOpenedShelfLife*
- purchaseState:storageState (normal/frozen)*
- isPreferencePermanent
- UPC (optional)
```

The variant ``unit`` must be of a compatible type with its generic's ``defaultUnit``.

*Maybe make defaults and purchase state mutable and potentially generic ID depending on implementation*

### Item Instance

An item instance is a physical representation of one [variant](#Variant). ==An item instance would be one single item you would find in your fridge or pantry.==

```
ItemInstance
- id*
- variantId*
- quantityRemaining
- unopenedShelfLife
- openedShelfLife
- spoilage (number 0-1)
- lastSpoilageUpdateTime
- storageState (normal/frozen)
- usageState (opened/unopened)
```

The item instance's ``quantityRemaining`` must always be less than or equal to its variant's ``size``. ``spoilage`` represents the fraction of total usable shelf life consumed. A ``spoilage`` of 1 means expired. Once an item's ``usageState`` is changed from unopened to opened, it **cannot** be reverted. However, an item's ``storageState`` can vary feely between normal and frozen.

#### State and Expiration Computation

There are two state enums, which represent how an item is being stored or used.

```
StorageState
- frozen
- normal
```

```
UsageState
- unopened
- opened
```

When an item instance is created, its ``usageState`` is defaulted to unopened, its ``storageState`` is inherited from its variant's ``purchaseState``, its ``unopenedShelfLife`` is inherited from its variant's ``defaultUnopenedShelfLife``, its ``openedShelfLife`` is inherited from its variant's ``defaultOpenedShelfLife``, its ``spoilage`` is set to 0, and its ``lastSpoilageUpdateTime`` is set to the current time. The item instance's shelf life fields can be changed without effecting the variant's defaults and are used to calculate freshness decay rates. The decay rate when frozen is 0. The ``spoilage`` data field represents the item's spoilage *up until* the ``lastSpoilageUpdateTime``. Upon any state change, spoilage is recalculated and ``lastSpoilageUpdateTime`` is updated. At any given time, expiration and freshness can be computed and estimated using the already elapsed ``spoilage`` and state since ``lastSpoilageUpdateTime``.

```
activeShelfLife =
  usageState === unopened
    ? unopenedShelfLife
    : openedShelfLife

activeDecayRate =
  storageState === frozen
    ? 0
    : 1 / activeShelfLife
```

### Summary of Mutability

> **Generics are intent-level abstractions and may evolve over time.** (Therefore mostly mutable)

> **Variants are physical product identities and are structurally immutable.** (Therefore structurally immutable)

> **ItemInstances represent reality and track time-dependent state.** (Therefore mostly mutable)

## The Shopping List

The shopping lists shows three things:

- Manually entered entries
- Automated meal plan fulfillment for a selected time period
- Low stock automatic top-off ([restock policy]())

Shopping lists can contain either [generics](#Generic) or [variants](#Variant), which would be displayed as,

```
- 2% Low Fat Milk
  0.5 gal
```

```
- Cheddar Cheese
  12 oz
  --> of which
      - Lucerne Cheddar Cheeze, 8 oz bag
        1 bag
```

The only **stored** data is:

```
ManualShoppingListEntry
- id*
- targetId
- quantity
- unit (must of compatible with target's unit)
```

The shopping list is a **view**, and all entries on it are derived by comparing the three entry sources to the current inventory and the shopping cart. The shopping list is recomputed only in response to state-changing events and never via time-based polling.

### Shopping List Aggregation Behavior

For each stock target, the shopping list displays the **maximum required quantity** across all active sources, minus any quantity already satisfied by the shopping cart.

For example, if:

- 2 oz parmesan required for recipe
- 6 oz from restock policy

The amount on the shopping list would be 6 oz, not 8 oz.

## The Building Blocks of Meal Planning

### Ingredient

The ingredient object is the basic object that represents one ingredient, only as a **[generic](#Generic)**.

```
Ingredient
- genericId*
- quantity
- unit (must be compatible with generic's unit)
```

### Recipe

A recipe is a reusable template

```
Recipe
- id*
- name
- ingredients[]
- servings
- tags
```

### Meal Definition

A meal definition is an instanced recipe that [meal plan entries](#Meal Plan Entry) point to.

```
MealDefintion
- id*
- sourceRecipeId* (nullable, immutable if present)
- name*
- ingredients[]*
- servings*
```

When a meal definition is created, if ``sourceRecipeId`` is ``null``, that mean it is a **detached instance**. When a meal definition is created (when a recipe is planned/used), it copies the mutable fields from the recipe into the immutable fields of the meal definition. Essentially, a meal definition is a frozen, no-longer-changeable, snapshot copy of the recipe that it was made with.

### Meal Plan Entry

A meal plan entry points to a meal definition with a date and time.

```
MealPlanEntry
- id*
- mealDefinitionId
- date
- mealType (enum: breakfast, lunch, dinner, snack)
- servingsMultiplier
- isCooked
```

Meal plan entries can reference varying meal definitions. When a meal plan originated from a recipe is detached and edited, a new meal definition is created which the meal plan entry is updated to point to.

Once a meal is cooked, it cannot be reverted.

## Restock Policies and Low Stock Thresholds

An enabled ``RestockPolicy`` must reference the same target as an enabled ``LowStockThreshold``.

### Low Stock Threshold

For either a [generic](#Generic) or [variant](#Variant), a low stock threshold can be specified given that is occupies a permanent spot. The low stock threshold warns the user on the inventory view that the item is running out (excluding spoiled items, including frozen items).

```
LowStockThreshold
- id*
- targetId*
- targetType (generic/variant)
- quantity
- unit
- isEnabled
```

### Low Stock Automatic Top-Off (Restock Policy)

A restock policy can be enable for an object only if that object has a low stock threshold. It saves a restock policy object to memory, that dictates how much of an item should be automatically added to the shopping list when it reaches or falls below the low stock threshold. 

> *"When [item] falls below [threshold], add [amount] to shopping list."*

```
RestockPolicy
- id*
- targetId* (generic/variant)
- targetType (generic/variant)
- mode (enum: fixedPurchase, topOffLevel)
- quantity
- unit
- isEnabled
```

If a restock policy mode is ``fixedPurchase`` enabled, it adds the ``quantity`` to the shopping list. If a restock policy mode is ``topOffLevel``, it adds the calcualted quantity required to reach ``quantity`` to the shopping list.

## Events

All events share a common envelope.

```
Event
- id*
- type*
- timestamp*
- source (enum: user, system, automation)
- metadata
```

```
Event
    - InventoryEvent
  			- ItemAddedEvent
  			- ItemUsedEvent
  			- ItemDiscardedEvent
  			- ItemRemovedEvent
    - StateTransitionEvent
    		- UsageStateChangedEvent
    		- StorageStateChangedEvent
    		- ShelfLifeAdjustedEvent
    		- SpoilageAccountingEvent
    		- SpoilageCheckpointEvent
    - MealSystemEvent
    		- MealCookedEvent
    		- MealDetachedEvent
    		- MealPlannedEvent
    		- MealEditedEvent
    - ShoppingSystemEvent
    		- ManualShoppingListEntryAddedEvent
    		- ManualShoppingListEntryRemovedEvent
    		- RestockPolicyTriggeredEvent
    		- LowStockThresholdUpdatedEvent
    		- RestockPolicyUpdatedEvent
    		
```



## Effective Quantities

For a given target (Generic or Variant), the effective available quantity is computed as:

```
EffectiveQuantity(target) =
  sum of quantityRemaining for all ItemInstances
  matching target
  where spoilage < 1
```

## Quantity Allocation Strategy

Allocation hierarchy for variant use:

1. Higher spoilage 
   Prevent waste
2. Opened over unopened 
   Real-world behavior
3. Earlier expiration 
   FIFO
4. Smaller remaining quantity 
   Reduce clutter
5. User preference (future) 
   Customization

## Using and Discarding Items

### Using Items

Item usage represents intentional consumption of food, either manually or as the result of cooking a meal.

When marking a recipe as cooked, it uses the [quantity allocation strategy](#Quantity Allocation Strategy) as well as user input (manual override or ambiguous cases) to source variants. These items are automatically deducted from stock. Spoiled items **cannot** be used. If an item instance is unopened and used, it automatically changes to opened. Once the quantity for an item instance goes to 0, it is removed. Users can also manually use items on-demand.

If consumption results in small fractional remainders that are impractical in real-world usage, the user may optionally round or truncate the remaining quantity. This action is treated as an additional usage or discard event and must be explicitly confirmed by the user.

### Discarding Items

Discarding represents intentional removal of food without consumption (e.g., spoilage, mistakes, waste).

Any item instance may be discarded regardless of spoilage state. Discarding follows the same quantity deduction rules as usage. If the remaining quantity reaches 0, the item instance is removed.

## UI and UX

The UI is a sleek, modern, yet technical theme, somwhat like what the shopify interface looks like, with consistent colors, buttons, etc. 

For now, there is no onboarding process.

The layout is a vertical view selector on the left, a horizontal top bar which shows which database the current instance is connected to (emtpy by default, the user must create one, **==databases are stored where the user specifies==**), and the primary selected view for the main section of the screen.

These are the views that the user can select from on the left

- Overview
- Inventory
- Shopping
- Planning