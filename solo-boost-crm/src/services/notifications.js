import { notifications, weeklyActivity } from "./mockData";
import { delay, clone } from "./api";

let store = clone(notifications);

export async function listNotifications() {
  return delay(clone(store), 200);
}

export async function markAllRead() {
  store = store.map((n) => ({ ...n, unread: false }));
  return delay(clone(store), 150);
}

export async function getWeeklyActivity() {
  return delay(clone(weeklyActivity));
}
