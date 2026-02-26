import {getFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderCheckBox(jsonQuestionData, questionContainer) {
    let checkbox = document.getElementById(jsonQuestionData.id);
    if (checkbox) {
        // reset to default if already exists
        checkbox.value = false;
        return;
    }

    checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = jsonQuestionData.id;

    try {
        checkbox.checked = JSON.parse(getFromLocalStorage(jsonQuestionData.id) ?? 'false');
    } catch (e) {
        checkbox.checked = false;
    }

    setToLocalStorage(jsonQuestionData.id, JSON.stringify(checkbox.checked));
    checkbox.onchange = () => {
        setToLocalStorage(jsonQuestionData.id, JSON.stringify(checkbox.checked));
    };
    questionContainer.appendChild(checkbox);
}
