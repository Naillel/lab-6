const STORAGE_KEY = 'tasks_v1';

export const StorageService = {

    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },

    save(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    },
};