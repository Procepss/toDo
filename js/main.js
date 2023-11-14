// Объект, содержащий ссылки на элементы страницы
const elements = {
  createTaskInput: document.querySelector(".container__createTask-input"),
  createTaskBtn: document.querySelector(".container__createTask-btn"),
  tasksList: document.querySelector(".container__tasks-list"),
  tasksEmpty: document.querySelector(".container__tasks-list-none"),
};

// Массив задач
let tasks = [];

// Функция для сохранения задач в localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Функция для загрузки задач из localStorage
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    updateTasks();
  }
}

// Изначальное состояние кнопки
if (!elements.createTaskInput.value) {
  elements.createTaskBtn.classList.add("disable-btn");
}

// Функция для обновления элементов
function updateTasks() {
  // Переключение видимости в зависимости от наличия задач
  elements.tasksEmpty.style.display = tasks.length === 0 ? "block" : "none";
  elements.tasksList.style.display = tasks.length === 0 ? "none" : "flex";

  // Генерация HTML для задач
  elements.tasksList.innerHTML = tasks
    .map((el, i) => {
      const doneClass = el.done ? "done" : "";
      const editMode = el.editing ? "edit-mode" : "";

      return `<li id="task-${i}" class="container__tasks-list-item ${doneClass} ${editMode}">
        ${
          el.editing
            ? `<input type="text" class="container__tasks-list-item-input-edit" value="${el.value}" 
                data-task-id="${i}" />`
            : `<input type="text" readonly class="container__tasks-list-item-input" value="${el.value}" />`
        }
        <div class="container__tasks-list-item-btns">
          <img src="done.svg" alt="Выполнено" class="container__tasks-list-item-done" />
          <img src="edit.svg" alt="Изменить" class="container__tasks-list-item-edit" />
          <img src="delete.svg" alt="Удалить" class="container__tasks-list-item-delete" />
        </div>
      </li>`;
    })
    .join("");

  // Добавление обработчиков для кнопок "Удалить"
  const deleteBtns = elements.tasksList.querySelectorAll(
    ".container__tasks-list-item-delete"
  );
  deleteBtns.forEach((el, i) => {
    el.addEventListener("click", () => {
      tasks.splice(i, 1);
      saveTasksToLocalStorage();
      updateTasks();
    });
  });

  // Добавление обработчиков для кнопок "Выполнено"
  const doneBtns = elements.tasksList.querySelectorAll(
    ".container__tasks-list-item-done"
  );
  doneBtns.forEach((el, i) => {
    el.addEventListener("click", () => {
      tasks[i].done = true;
      saveTasksToLocalStorage();
      updateTasks();
    });
  });

  // Добавление обработчиков для кнопок "Изменить"
  const editBtns = elements.tasksList.querySelectorAll(
    ".container__tasks-list-item-edit"
  );
  editBtns.forEach((el) => {
    el.addEventListener("click", () => {
      const taskId = el.parentNode.parentNode.id.split("-")[1];
      tasks[taskId].editing = !tasks[taskId].editing;
      saveTasksToLocalStorage();
      updateTasks();

      // После изменения состояния задачи, установите фокус на соответствующее поле ввода
      if (tasks[taskId].editing) {
        const editInput = elements.tasksList.querySelector(
          `#task-${taskId} .container__tasks-list-item-input-edit`
        );
        if (editInput) {
          editInput.focus();
        }
      }
    });
  });

  // Добавление обработчиков для полей ввода редактирования с клавишей Enter
  const editInputs = elements.tasksList.querySelectorAll(
    ".container__tasks-list-item-input-edit"
  );
  editInputs.forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        const taskId = el.dataset.taskId;
        tasks[taskId].value = el.value.trim();
        tasks[taskId].editing = false;
        saveTasksToLocalStorage();
        updateTasks();
      }
    });

    // Добавление обработчика для сохранения изменений при потере фокуса
    el.addEventListener("blur", () => {
      const taskId = el.dataset.taskId;
      tasks[taskId].value = el.value.trim();
      tasks[taskId].editing = false;
      saveTasksToLocalStorage();
      updateTasks();
    });
  });
}

// Обработчик для ввода в поле "Создать задачу"
elements.createTaskInput.addEventListener("input", () => {
  const inputValue = elements.createTaskInput.value.trim();
  elements.createTaskBtn.classList.toggle("disable-btn", !inputValue);
});

// Функция для обработки события клика по кнопке "Создать задачу"
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
    saveTasksToLocalStorage();
    updateTasks();
  }
}

// Обработчик для кнопки "Создать задачу"
elements.createTaskBtn.addEventListener("click", createTask);

// Обработчик для ввода в поле "Создать задачу" с учетом клавиши Enter
elements.createTaskInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    createTask();
  }
});

// Инициализация при загрузке страницы
loadTasksFromLocalStorage();
