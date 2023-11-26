//Images
import doneImg from "@assets/done.svg";
import editImg from "@assets/edit.svg";
import deleteImg from "@assets/delete.svg";

/** Объект, содержащий ссылки на элементы страницы */
export const elements = {
  createTaskInput: document.querySelector(".container__createTask-input"),
  createTaskBtn: document.querySelector(".container__createTask-btn"),
  tasksList: document.querySelector(".container__tasks-list"),
  tasksEmpty: document.querySelector(".container__tasks-list-none"),
};

/** Функция создания разметки для задачи */
export function createTaskHtml({ element, tasksArray }) {
  return (element.innerHTML = tasksArray
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
        <img src="${doneImg}" alt="Выполнено" class=" container__tasks-list-item-btn container__tasks-list-item-done" />
        <img src="${editImg}" alt="Изменить" class="container__tasks-list-item-btn container__tasks-list-item-edit" />
        <img src="${deleteImg}" alt="Удалить" class="container__tasks-list-item-btn container__tasks-list-item-delete" />
      </div>
    </li>`;
    })
    .join(""));
}
