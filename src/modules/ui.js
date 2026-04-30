// ─── Módulo 3: ui.js ──────────────────────────────────────────────────────────
// Responsabilidad: renderizar el DOM y manejar eventos.
// Usa Event Delegation: un único listener en <ul> para TODOS los clicks de lista.

import { TaskService } from './tasks.js';

// ── Referencias al DOM ────────────────────────────────────────────────────────
const taskInput   = document.querySelector('#taskInput');
const addBtn      = document.querySelector('#addBtn');
const taskList    = document.querySelector('#taskList');
const pendingCount = document.querySelector('#pendingCount');
const clearBtn    = document.querySelector('#clearBtn');

// ── Helpers de renderizado ────────────────────────────────────────────────────

/**
 * Crea un <li> a partir de un objeto tarea.
 * @param {{ id: string, text: string, completed: boolean }} task
 * @returns {HTMLLIElement}
 */
const createTaskItem = ({ id, text, completed }) => {
    const li = document.createElement('li');
    li.dataset.id = id;
    if (completed) li.classList.add('completed');

    li.innerHTML = `
        <span class="task-text">${escapeHtml(text)}</span>
        <div class="task-actions">
            <button class="complete-btn" data-action="toggle" aria-label="Marcar completada">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </button>
            <button class="delete-btn" data-action="delete" aria-label="Eliminar tarea">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `;
    return li;
};

/** Escapa caracteres peligrosos para evitar XSS al insertar texto libre. */
const escapeHtml = str =>
    str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
       .replace(/"/g,'&quot;').replace(/'/g,'&#039;');

/** Actualiza el contador de tareas pendientes en el header. */
const updateCounter = () => {
    const n = TaskService.countPending();
    pendingCount.textContent = `${n} pendiente${n !== 1 ? 's' : ''}`;
    pendingCount.classList.toggle('zero', n === 0);
};

/** Renderiza desde cero todas las tareas del arreglo. */
const renderAll = () => {
    taskList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    TaskService.getAll().forEach(task => fragment.appendChild(createTaskItem(task)));
    taskList.appendChild(fragment);
    updateCounter();
};

// ── Acciones ──────────────────────────────────────────────────────────────────

const handleAdd = () => {
    const task = TaskService.add(taskInput.value);
    if (!task) {
        taskInput.classList.add('shake');
        taskInput.addEventListener('animationend', () => taskInput.classList.remove('shake'), { once: true });
        return;
    }
    taskList.appendChild(createTaskItem(task));
    taskInput.value = '';
    taskInput.focus();
    updateCounter();
};

// ── Event Delegation: un solo listener en la raíz <ul> ────────────────────────
taskList.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const li = btn.closest('li[data-id]');
    if (!li) return;

    const { id } = li.dataset;
    const action = btn.dataset.action;

    if (action === 'toggle') {
        const completed = TaskService.toggle(id);
        li.classList.toggle('completed', completed);
        updateCounter();
    }

    if (action === 'delete') {
        li.classList.add('removing');
        li.addEventListener('animationend', () => {
            TaskService.remove(id);
            li.remove();
            updateCounter();
        }, { once: true });
    }
});

// ── Otros listeners ───────────────────────────────────────────────────────────
addBtn.addEventListener('click', handleAdd);

taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleAdd();
});

clearBtn.addEventListener('click', () => {
    document.querySelectorAll('li.completed').forEach(li => li.classList.add('removing'));
    // Esperamos la animación del último elemento antes de limpiar estado
    const completedItems = document.querySelectorAll('li.completed');
    if (!completedItems.length) return;
    let done = 0;
    completedItems.forEach(li => {
        li.addEventListener('animationend', () => {
            done++;
            if (done === completedItems.length) {
                TaskService.clearCompleted();
                renderAll();
            }
        }, { once: true });
    });
});

// ── Carga inicial ─────────────────────────────────────────────────────────────
renderAll();