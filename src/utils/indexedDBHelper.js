import { openDB } from "idb";

// ✅ Open IndexedDB
const dbPromise = openDB("SchoolDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("assignedSubjects")) {
      db.createObjectStore("assignedSubjects", { keyPath: "subject_code" });
    }
  },
});

export const useIndexedDB = (storeName) => ({
  async getAll() {
    return (await dbPromise).getAll(storeName);
  },
  async add(value) {
    return (await dbPromise).put(storeName, value);
  },
  async remove(key) {
    return (await dbPromise).delete(storeName, key);
  },
  async clear() {
    return (await dbPromise).clear(storeName); // ✅ Clear all entries
  },
});
