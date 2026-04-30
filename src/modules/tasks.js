// ─── Módulo 2: tasks.js ───────────────────────────────────────────────────────
// Responsabilidad: toda la lógica de negocio (CRUD sobre el arreglo de tareas).
// NO toca el DOM directamente.

import { StorageService } from './storage.js';

/**
 * Genera un ID único simple basado en timestamp + random.
 * @returns {string}
 */
const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const TaskService = (() => {
    /** @type {Array<{id: string, text: string, completed: boolean}>} */
    let tasks = StorageService.load();

    const persist = () => StorageService.save(tasks);

    return {
        /** Devuelve una copia del arreglo actual (inmutable desde fuera). */
        getAll() {
            return [...tasks];
        },

        /**
         * Agrega una tarea nueva al arreglo.
         * @param {string} text
         * @returns {{ id: string, text: string, completed: boolean } | null}
         */
        add(text) {
            const trimmed = text.trim();
            if (!trimmed) return null;

            const task = { id: generateId(), text: trimmed, completed: false };
            tasks.push(task);
            persist();
            return task;
        },

        /**
         * Alterna el estado completado de una tarea por su ID.
         * @param {string} id
         * @returns {boolean} nuevo estado `completed`
         */
        toggle(id) {
            const task = tasks.find(t => t.id === id);
            if (!task) return false;
            task.completed = !task.completed;
            persist();
            return task.completed;
        },

        /**
         * Elimina una tarea por su ID.
         * @param {string} id
         */
        remove(id) {
            tasks = tasks.filter(t => t.id !== id);
            persist();
        },

        /** Elimina todas las tareas marcadas como completadas. */
        clearCompleted() {
            tasks = tasks.filter(t => !t.completed);
            persist();
        },

        /** Cuenta las tareas que aún no están completadas. */
        countPending() {
            return tasks.filter(t => !t.completed).length;
        },
    };
})();