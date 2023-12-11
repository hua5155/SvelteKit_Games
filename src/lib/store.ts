import { writable } from "svelte/store";

export function createStore<Type>(initValue: Type) {
  const store = writable<Type>(initValue)

  function reset() {
    store.set(initValue)
  }

  return {
    ...store,
    reset
  }
}