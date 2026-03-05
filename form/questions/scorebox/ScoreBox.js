import {getFromLocalStorage, isInLocalStorage, removeFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderScoreBox(jsonQuestionData, questionContainer) {

    const MIN_VALUE = jsonQuestionData.minValue || 0;
    const MAX_VALUE = jsonQuestionData.maxValue || 100;
    const DEFAULT_VALUE = jsonQuestionData.defaultValue || 0;
    const skippable = jsonQuestionData.skippable || false;
    const id = jsonQuestionData.id;

    let input = document.getElementById(id);
    if (input) {
        if (!skippable) {
            input.value = null;
            removeFromLocalStorage(id);

        } else {
            input.value = DEFAULT_VALUE;
            setToLocalStorage(id, DEFAULT_VALUE)
        }

        input.classList.remove('invalid');
        return;
    }

    input = document.createElement('input');
    input.type = 'number';
    input.id = id;
    input.min = MIN_VALUE;
    input.max = MAX_VALUE;

    if (isInLocalStorage(id)) {
        input.value = getFromLocalStorage(id); // load saved

    } else {
        if (!skippable) {
            input.value = null;
            removeFromLocalStorage(id);

        } else {
            input.value = DEFAULT_VALUE;
            setToLocalStorage(id, DEFAULT_VALUE)
        }
    }

    const saveValue = () => {
        if (input.value < Number(input.min) || input.value > Number(input.max) ||
            input.value === "" || input.value === null || !Number.isInteger(Number(input.value))) {

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

    const container = document.createElement('div');
    container.appendChild(decButton);
    container.appendChild(input);
    container.appendChild(incButton);
    questionContainer.appendChild(container);
}