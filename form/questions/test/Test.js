import {getFromLocalStorage, removeFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;

export function renderTest(jsonQuestionData, questionContainer) {

    const MIN_VALUE = jsonQuestionData.minValue ?? DEFAULT_MIN_VALUE;
    const MAX_VALUE = jsonQuestionData.maxValue ?? DEFAULT_MAX_VALUE;
    const DEFAULT_VALUE = jsonQuestionData.defaultValue;

    let input = document.getElementById(jsonQuestionData.id);
    if (input) {
        // reset to default if already exists
        input.value = DEFAULT_VALUE;
        setToLocalStorage(jsonQuestionData.id, DEFAULT_VALUE);
        return;
    }
    questionContainer.innerHTML = ''; // remove the default title

    input = document.createElement('input');
    input.type = 'number';
    input.id = jsonQuestionData.id;
    input.min = MIN_VALUE;
    input.max = MAX_VALUE;

    input.value = getFromLocalStorage(jsonQuestionData.id) ?? DEFAULT_VALUE
    setToLocalStorage(jsonQuestionData.id, input.value);

    const title = document.createElement('h1');
    title.textContent = jsonQuestionData.title;

    const inputContainer = document.createElement('div');
    inputContainer.append(title, input)

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
    incContainer.append(incButton5, incButton10);

    const container = document.createElement('div');
    container.appendChild(decContainer);
    container.appendChild(inputContainer);
    container.appendChild(incContainer);
    questionContainer.appendChild(container);
}
