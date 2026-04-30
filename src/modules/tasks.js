
import { StorageService } from './storage.js';

/**
 * @returns {string}
 */
const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const TaskService = (() => {
    /** @type {Array<{id: string, text: string, completed: boolean}>} */
    let tasks = StorageService.load();

    const persist = () => StorageService.save(tasks);

    return {

        getAll() {
            return [...tasks];
        },
        add(text) {
            const trimmed = text.trim();
            if (!trimmed) return null;

            const task = { id: generateId(), text: trimmed, completed: false };
            tasks.push(task);
            persist();
            return task;
        },


        toggle(id) {
            const task = tasks.find(t => t.id === id);
            if (!task) return false;
            task.completed = !task.completed;
            persist();
            return task.completed;
        },

        remove(id) {
            tasks = tasks.filter(t => t.id !== id);
            persist();
        },

        clearCompleted() {
            tasks = tasks.filter(t => !t.completed);
            persist();
        },


        countPending() {
            return tasks.filter(t => !t.completed).length;
        },
    };
})();