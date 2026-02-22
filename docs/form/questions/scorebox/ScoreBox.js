import {getFromLocalStorage, removeFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;
const DEFAULT_START_VALUE = 0;

export function renderScoreBox(jsonQuestionData, questionContainer) {

    const MIN_VALUE = jsonQuestionData.minValue ?? DEFAULT_MIN_VALUE;
    const MAX_VALUE = jsonQuestionData.maxValue ?? DEFAULT_MAX_VALUE;
    const DEFAULT_VALUE = jsonQuestionData.defaultValue ?? DEFAULT_START_VALUE;

    let input = document.getElementById(jsonQuestionData.id);
    if (input) {
        // reset to default if already exists
        input.value = input.defaultValue;
        setToLocalStorage(jsonQuestionData.id, input.defaultValue);
        return;
    }

    const container = document.createElement('div');
    input = document.createElement('input');
    input.type = 'number';
    input.id = jsonQuestionData.id;
    input.min = MIN_VALUE;
    input.max = MAX_VALUE;
    input.defaultValue = DEFAULT_VALUE

    input.value = getFromLocalStorage(jsonQuestionData.id) ?? input.defaultValue;
    setToLocalStorage(jsonQuestionData.id, input.value);

    const saveValue = () => {
        if (input.value < Number(input.min) || input.value > Number(input.max) ||
            input.value === "" || !Number.isInteger(Number(input.value))) {
            input.classList.add('invalid');
            removeFromLocalStorage(jsonQuestionData.id);
        } else {
            input.classList.remove('invalid');
            setToLocalStorage(jsonQuestionData.id, input.value);
        }
    };
    input.oninput = saveValue;

    const decButton = document.createElement('button');
    decButton.textContent = '−';
    decButton.onclick = () => {
        input.stepDown();
        saveValue();
    };

    const incButton = document.createElement('button');
    incButton.textContent = '+';
    incButton.onclick = () => {
        input.stepUp();
        saveValue();
    }

    container.appendChild(decButton);
    container.appendChild(input);
    container.appendChild(incButton);
    questionContainer.appendChild(container);
}