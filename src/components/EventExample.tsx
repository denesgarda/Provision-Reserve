import React, { useState } from 'react';
import { useEventStore } from '../hooks';
import { createInventoryEvent, InventoryEventType, EventSource } from '../types';

/**
 * Example component demonstrating how to use the event system
 * This shows how to record events with undo/redo capabilities
 */
export function EventExample() {
  const [counter, setCounter] = useState(0);
  const { recordEvent } = useEventStore();

  const handleIncrement = async () => {
    const previousValue = counter;
    const newValue = counter + 1;

    // Create an undo/redo action
    const action = {
      event: createInventoryEvent(
        InventoryEventType.ITEM_ADDED,
        EventSource.USER,
        { itemId: 'example-item', quantity: 1 }
      ),
      undoFn: () => setCounter(previousValue),
      redoFn: () => setCounter(newValue),
      description: `Increment counter to ${newValue}`
    };

    await recordEvent(action);
  };

  const handleDecrement = async () => {
    const previousValue = counter;
    const newValue = counter - 1;

    // Only allow decrement if counter > 0
    if (previousValue <= 0) return;

    const action = {
      event: createInventoryEvent(
        InventoryEventType.ITEM_REMOVED,
        EventSource.USER,
        { itemId: 'example-item', quantity: 1 }
      ),
      undoFn: () => setCounter(previousValue),
      redoFn: () => setCounter(newValue),
      description: `Decrement counter to ${newValue}`
    };

    await recordEvent(action);
  };

  return (
    <div className="event-example">
      <h3>Event System Example</h3>
      <p>Counter: {counter}</p>
      <div>
        <button onClick={handleIncrement}>Increment (+)</button>
        <button onClick={handleDecrement} disabled={counter <= 0}>
          Decrement (-)
        </button>
      </div>
      <p>
        Use the toolbar undo/redo buttons above to undo and redo these actions!
      </p>
    </div>
  );
}
