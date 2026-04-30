// ─── Módulo 1: storage.js ─────────────────────────────────────────────────────
// Responsabilidad: persistir y recuperar el arreglo de tareas en localStorage.

const STORAGE_KEY = 'tasks_v1';

export const StorageService = {
    /**
     * Carga las tareas guardadas. Devuelve un arreglo vacío si no hay nada.
     * @returns {Array<{id: string, text: string, completed: boolean}>}
     */
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },

    /**
     * Persiste el arreglo completo de tareas.
     * @param {Array} tasks
     */
    save(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    },
};