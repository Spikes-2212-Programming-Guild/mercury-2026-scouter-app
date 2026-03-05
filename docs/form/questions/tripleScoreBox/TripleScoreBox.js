import {getFromLocalStorage, isInLocalStorage, removeFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderTripleScoreBox(jsonQuestionData, questionContainer) {

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
            input.value === "" || !Number.isInteger(Number(input.value))) {
            input.classList.add('invalid');
            removeFromLocalStorage(id);
        } else {
            input.classList.remove('invalid');
            setToLocalStorage(id, input.value);
        }
    };
    input.oninput = saveValue;

    const decButton10 = document.createElement('button');
    decButton10.textContent = '−10';
    decButton10.onclick = () => {
        input.stepDown(10);
        saveValue();
    }

    const decButton5 = document.createElement('button');
    decButton5.textContent = '−5';
    decButton5.onclick = () => {
        input.stepDown(5);
        saveValue();
    }

    const decContainer = document.createElement('div');
    decContainer.append(decButton5, decButton10);

    const incButton10 = document.createElement('button');
    incButton10.textContent = '+10';
    incButton10.onclick = () => {
        input.stepUp(10);
        saveValue();
    }

    const incButton5 = document.createElement('button');
    incButton5.textContent = '+5';
    incButton5.onclick = () => {
        input.stepUp(5);
        saveValue();
    }

    const incContainer = document.createElement('div');
    incContainer.append(incButton10, incButton5);

    const container = document.createElement('div');
    container.appendChild(decContainer);
    container.appendChild(input);
    container.appendChild(incContainer);
    questionContainer.appendChild(container);
}
