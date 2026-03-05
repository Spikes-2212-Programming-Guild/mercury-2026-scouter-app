import {getFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderInputBox(jsonQuestionData, questionContainer) {
    let input = document.getElementById(jsonQuestionData.id);
    if (input) {
        // reset to default if already exists
        input.value = '';
        return;
    }

    input = document.createElement('input');
    input.type = 'text';
    input.id = jsonQuestionData.id;
    input.value = getFromLocalStorage(jsonQuestionData.id) || null;

    input.oninput = () => {
        if (input.value === '' || input.value.trim() === '') {
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
        setToLocalStorage(jsonQuestionData.id, input.value)
    };
    questionContainer.appendChild(input);
}
