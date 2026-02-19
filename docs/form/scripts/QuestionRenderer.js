import {SCOREBOX_DEFAULT_VALUE, SCOREBOX_MAX_VALUE, SCOREBOX_MIN_VALUE} from "./Constants.js";
import {getFromLocalStorage, removeFromLocalStorage, setToLocalStorage} from "../../Storage.js";

// a map of question types to their respective renderers
export const questionRenderers = {
    'TextBox': renderTextBox,
    'Radio': renderRadio,
    'List': renderList,
    'AutoCompleteRadio': renderAutoCompleteRadio,
    'ScoreBox': renderScoreBox,
    'CommentBox': renderCommentBox,
    'RangeBox': renderRangeBox,
};

/*
    Each method is responsible for rendering a specific question type.

    Responsibilities:
    - Create and append the question’s DOM element(s) into the given container.
    - Load any previously saved response from localStorage.
    - Add listeners to save changes back to localStorage.

    Behavior:
    - On the first call: renders the element with saved or default values.
    - On later calls: resets the element to its default state.
*/

function renderCommentBox(jsonQuestionData, questionContainer) {
    let textarea = document.getElementById(jsonQuestionData.id);
    if (textarea) {
        // reset to default if already exists
        textarea.value = '';
        return;
    }

    textarea = document.createElement('textarea');
    textarea.id = jsonQuestionData.id;
    textarea.value = getFromLocalStorage(jsonQuestionData.id) ?? '';
    textarea.oninput = () => {
        setToLocalStorage(jsonQuestionData.id, textarea.value)
        // adjust size based on amount of lines
        textarea.style.height = 'auto'
        textarea.style.height  = `${textarea.scrollHeight}px`
    };
    questionContainer.appendChild(textarea);
}

function renderRangeBox(jsonQuestionData, questionContainer) {

    const DEFAULT_START = Number(jsonQuestionData.startingValue ?? 0);
    const JUMP_LENGTH  = Number(jsonQuestionData.jumpLength ?? 0);
    const MAX_VALUE  = Number(jsonQuestionData.max ?? 200);
    const MIN_VALUE  = Number(jsonQuestionData.min ?? 0);

    /*
        TODO:
         fix the css where the buttons move when the label grow
     */

    const setRange = (label, start, end) => {
        label.dataset.start = start;
        label.dataset.end = end;
        label.textContent = `${start} - ${end}`;
        setToLocalStorage(jsonQuestionData.id, `${start}-${end}`);
    };

    const getRange = (label) => [
        Number(label.dataset.start),
        Number(label.dataset.end),
    ];

    const initRange = () => {
        const stored = getFromLocalStorage(jsonQuestionData.id);
        return stored ? stored.split('-').map(Number) :
            [DEFAULT_START, DEFAULT_START + JUMP_LENGTH];
    };

    let label = document.getElementById(jsonQuestionData.id);
    if (label) {
        // reset to default if already exists
        const [start, end] = initRange();
        setRange(label, start, end);
        return;
    }

    const container = document.createElement('div');
    label = document.createElement('label');
    label.id = jsonQuestionData.id;

    const [start, end] = initRange();
    setRange(label, start, end);

    const shiftRange = (direction) => {
        const [start, end] = getRange(label);
        const jump = end - start;

        const newEnd = end + direction * jump;
        const newStart = start + direction * jump;
        if (newEnd > MAX_VALUE || newStart < MIN_VALUE) return;
        setRange(label, newStart, newEnd);
    };

    const decButton = document.createElement('button');
    decButton.textContent = '−';
    decButton.onclick = () => shiftRange(-1);

    const incButton = document.createElement('button');
    incButton.textContent = '+';
    incButton.onclick = () => shiftRange(1);

    container.appendChild(decButton);
    container.appendChild(label);
    container.appendChild(incButton);
    questionContainer.appendChild(container);
}

function renderScoreBox(jsonQuestionData, questionContainer) {

    const MIN_VALUE = jsonQuestionData.minValue ?? SCOREBOX_MIN_VALUE;
    const MAX_VALUE = jsonQuestionData.maxValue ?? SCOREBOX_MAX_VALUE;
    const DEFAULT_VALUE = jsonQuestionData.defaultValue ?? SCOREBOX_DEFAULT_VALUE;

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

function renderAutoCompleteRadio(jsonQuestionData, questionContainer) {
    const id = jsonQuestionData.id;
    let input = document.getElementById(id);
    if (input) {
        // reset to default if already exists
        input.value = '';
        return;
    }

    input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.value = getFromLocalStorage(id);

    const datalist = document.createElement('datalist');
    datalist.id = id + '-list';

    for (const c of jsonQuestionData.choices) {
        const option1 = document.createElement('option');

        option1.value = c.value;
        option1.label = c.description

        const option2 = document.createElement('option');

        option2.value = c.value;

        datalist.append(option1, option2);
    }

    // connect the datalist to the input
    input.setAttribute('list', datalist.id);

    // format to String to fix type and formating issues
    const allowedValues = new Set(jsonQuestionData.choices.map(c => String(c.value).trim()));
    input.oninput = () => {
        const value = input.value.trim();
        if (!allowedValues.has(value)) {
            input.classList.add("invalid");
            removeFromLocalStorage(id);
        } else {
            input.classList.remove("invalid");
            setToLocalStorage(id, value);
        }
    };

    questionContainer.appendChild(input);
    questionContainer.appendChild(datalist);
}

function renderRadio(jsonQuestionData, questionContainer) {
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

function renderList(jsonQuestionData, questionContainer) {
    const id = jsonQuestionData.id;
    let select = document.getElementById(id);
    if (select) {
        // reset to default if already exists
        select.value = '';
        select.classList.remove('invalid');
        return;
    }

    select = document.createElement('select');
    select.id = id;
    select.multiple = Boolean(jsonQuestionData.multiple);
    select.size = 1; // to turn multiple into a single select

    for (const c of jsonQuestionData.choices) {
        const option = document.createElement('option');
        option.id = id + '-' + c;
        option.textContent = c;
        option.value = c;
        select.appendChild(option);
    }

    const saved = getFromLocalStorage(id);
    if (select.multiple) {
        // select the previously saved options
        const savedOptions = new Set(saved ? saved.split(',') : []);
        for (const option of select.options) {
            option.selected = savedOptions.has(option.value);
        }

        select.onchange = () => {
            const selected =
                Array.from(select.selectedOptions, o => o.value);
            setToLocalStorage(id, selected.join(','));
            select.classList.remove('invalid');
        }
    } else {
        select.value = saved;
        select.onchange = () => {
            setToLocalStorage(id, select.value)
            select.classList.remove('invalid');
        };
    }

    questionContainer.appendChild(select);
}

function renderTextBox(jsonQuestionData, questionContainer) {
    let textBox = document.getElementById(jsonQuestionData.id);
    if (textBox) {
        // reset to default if already exists
        textBox.value = '';
        return;
    }

    textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.id = jsonQuestionData.id;
    textBox.value = getFromLocalStorage(jsonQuestionData.id) ?? '';
    textBox.oninput = () => {
        if (textBox.value === '') {
            textBox.classList.add('invalid');
        } else {
            textBox.classList.remove('invalid');
        }
        setToLocalStorage(jsonQuestionData.id, textBox.value)
    };
    questionContainer.appendChild(textBox);
}