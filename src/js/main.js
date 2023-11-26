//Helpers
import { handleVisible, saveToLocalStorage, getAllSelectors } from "./helpers";

//Render
import { createTaskHtml } from "./render.js";

// Объект, содержащий ссылки на элементы страницы
import { elements } from "./render.js";

/** Массив задач */
let tasks = [];

const saveTasks = () =>
  saveToLocalStorage({
    name: "tasks",
    target: tasks,
  });

/** Фунция обновления и сохранения задач */
function saveAndRefreshTasks() {
  saveTasks();
  updateTasks();
}

/** Функция для загрузки задач из localStorage */
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    updateTasks();
  }
}

function handleClickWithSave({ element, callback }) {
  element.forEach((el, i) => {
    el.addEventListener("click", () => {
      callback(i, el);
      saveAndRefreshTasks();
    });
  });
}

/** Изначальное состояние кнопки */
if (!elements.createTaskInput.value) {
  elements.createTaskBtn.classList.add("disable-btn");
}

/** Функция для обновления элементов */
function updateTasks() {
  handleVisible({
    element: elements.tasksEmpty,
    state1: "block",
    state2: "none",
    tasksArray: tasks,
  });
  handleVisible({
    element: elements.tasksList,
    state1: "none",
    state2: "flex",
    tasksArray: tasks,
  });

  createTaskHtml({ element: elements.tasksList, tasksArray: tasks });

  /** Добавление обработчиков для кнопок "Удалить" */
  const deleteBtns = getAllSelectors({
    element: elements.tasksList,
    className: ".container__tasks-list-item-delete",
  });

  handleClickWithSave({
    element: deleteBtns,
    callback: (i) => tasks.splice(i, 1),
  });

  /** Добавление обработчиков для кнопок "Выполнено" */
  const doneBtns = getAllSelectors({
    element: elements.tasksList,
    className: ".container__tasks-list-item-done",
  });

  handleClickWithSave({
    element: doneBtns,
    callback: (i) => (tasks[i].done = true),
  });

  /** Добавление обработчиков для кнопок "Изменить" */
  const editBtns = getAllSelectors({
    element: elements.tasksList,
    className: ".container__tasks-list-item-edit",
  });

  handleClickWithSave({
    element: editBtns,
    callback: (__, el) => {
      const taskId = el.parentNode.parentNode.id.split("-")[1];
      tasks[taskId].editing = !tasks[taskId].editing;

      if (tasks[taskId].editing) {
        const editInput = elements.tasksList.querySelector(
          `#task-${taskId} .container__tasks-list-item-input-edit`
        );
        if (editInput) {
          editInput.focus();
        }
      }
    },
  });

  /** Добавление обработчиков для полей ввода редактирования с клавишей Enter */
  const editInputs = getAllSelectors({
    element: elements.tasksList,
    className: ".container__tasks-list-item-input-edit",
  });

  editInputs.forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        const taskId = el.dataset.taskId;
        tasks[taskId].value = el.value.trim();
        tasks[taskId].editing = false;
        saveAndRefreshTasks();
      }
    });

    /** Добавление обработчика для сохранения изменений при потере фокуса */
    el.addEventListener("blur", () => {
      const taskId = el.dataset.taskId;
      tasks[taskId].value = el.value.trim();
      tasks[taskId].editing = false;
      saveAndRefreshTasks();
    });
  });
}

/** Обработчик для ввода в поле "Создать задачу" */
elements.createTaskInput.addEventListener("input", () => {
  const inputValue = elements.createTaskInput.value.trim();
  elements.createTaskBtn.classList.toggle("disable-btn", !inputValue);
});

/** Функция для обработки события клика по кнопке "Создать задачу" */
function createTask() {
  const inputValue = elements.createTaskInput.value.trim();
  if (inputValue) {
    const newTask = {
      id: tasks.length,
      value: inputValue,
      editing: false,
      done: false,
    };
    tasks.push(newTask);
    elements.createTaskInput.value = "";
    elements.createTaskBtn.classList.add("disable-btn");
    saveAndRefreshTasks();
  }
}

/** Обработчик для кнопки "Создать задачу" */
elements.createTaskBtn.addEventListener("click", createTask);

/** Обработчик для ввода в поле "Создать задачу" с учетом клавиши Enter */
elements.createTaskInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    createTask();
  }
});

/** Инициализация при загрузке страницы */
loadTasksFromLocalStorage();
