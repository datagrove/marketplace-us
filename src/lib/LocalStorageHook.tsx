import { createSignal, createEffect, onCleanup } from "solid-js";

// Create a map to store signals for different localStorage keys
const storageSignals = new Map();

function useLocalStorage(key: string, initialValue: string) {
  // Get or create a signal for the localStorage key
  if (!storageSignals.has(key)) {
    const storedValue = localStorage.getItem(key);
    const signal = createSignal(storedValue !== null ? storedValue : initialValue);
    storageSignals.set(key, signal);
  }

  const [value, setValue] = storageSignals.get(key);

  // Update localStorage when the signal value changes
  createEffect(() => {
    localStorage.setItem(key, value());
  });

  // Update the signal when localStorage changes (across tabs)
const onStorageChange = (event: StorageEvent) => {
    if (event.key === key) {
      setValue(event.newValue);
    }
  };
  window.addEventListener("storage", onStorageChange);

  // Clean up the event listener when the component is unmounted
  onCleanup(() => {
    window.removeEventListener("storage", onStorageChange);
  });

  return [value, setValue];
}

export default useLocalStorage;