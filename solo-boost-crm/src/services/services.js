import { servicesCatalog } from "./mockData";
import { delay, clone } from "./api";

let store = clone(servicesCatalog);

export async function listServices() {
  return delay(clone(store));
}

export async function toggleService(id) {
  store = store.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
  return delay(clone(store), 150);
}
