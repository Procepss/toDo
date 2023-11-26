/** Переключение видимости в зависимости от наличия задач */
export function handleVisible({ element, state1, state2, tasksArray }) {
  return (element.style.display = tasksArray.length === 0 ? state1 : state2);
}

/** Функция для сохранения задач в localStorage */
export function saveToLocalStorage({ name, target }) {
  localStorage.setItem(name, JSON.stringify(target));
}

/** Поиск элементов */
export function getAllSelectors({ element, className }) {
  return element.querySelectorAll(className);
}
