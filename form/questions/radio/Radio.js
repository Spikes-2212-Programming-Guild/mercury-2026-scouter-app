import {getFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderRadio(jsonQuestionData, questionContainer) {
    const id = jsonQuestionData.id;
    let radio = document.getElementById(id);

    if (radio) {
        // reset to default if already exists
        radio.querySelectorAll("input[type=radio]")
            .forEach(choice => choice.checked = false);
        radio.classList.remove('invalid');
        return;
    }

    radio = document.createElement('form');
    radio.id = id;
    radio.style.flexDirection = 'row'

    const savedValue = getFromLocalStorage(id);
    for (const c of jsonQuestionData.choices) {
        const choice = document.createElement('input');
        choice.type = 'radio';
        choice.id = id + '-' + c;
        choice.name = id;
        choice.value = c;
        choice.checked = savedValue === c

        choice.onclick = () => {
            setToLocalStorage(id, c);
            radio.classList.remove('invalid');
        };

        const label = document.createElement('label');
        label.textContent = c;
        label.htmlFor = choice.id;

        radio.appendChild(choice);
        radio.appendChild(label);
    }
    questionContainer.appendChild(radio);
}