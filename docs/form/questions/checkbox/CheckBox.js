import {getFromLocalStorage, isInLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderCheckBox(jsonQuestionData, questionContainer) {
    const id = jsonQuestionData.id;
    let checkbox = document.getElementById(id);
    if (checkbox) {

        checkbox.checked = false;
        setToLocalStorage(id, checkbox.checked);

        checkbox.classList.remove('invalid');
        return;
    }

    checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;

    if (isInLocalStorage(id)) {
        checkbox.checked = getFromLocalStorage(id)
    } else {
        checkbox.checked = false;
    }
    setToLocalStorage(id, checkbox.checked);

    checkbox.onchange = () => {
        setToLocalStorage(id, checkbox.checked);
    };
    questionContainer.appendChild(checkbox);
}
