import {getFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderRangeBox(jsonQuestionData, questionContainer) {

    const DEFAULT_START = Number(jsonQuestionData.startingValue ?? 0);
    const JUMP_LENGTH = Number(jsonQuestionData.jumpLength ?? 0);
    const MAX_VALUE = Number(jsonQuestionData.max ?? 200);
    const MIN_VALUE = Number(jsonQuestionData.min ?? 0);

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

    const getInitRange = () => {
        const stored = getFromLocalStorage(jsonQuestionData.id);
        return stored ? stored.split('-').map(Number) :
            [DEFAULT_START, DEFAULT_START];
    };

    let label = document.getElementById(jsonQuestionData.id);
    if (label) {
        // reset to default if already exists
        const [start, end] = getInitRange();
        setRange(label, start, end);
        return;
    }

    const container = document.createElement('div');
    label = document.createElement('label');
    label.id = jsonQuestionData.id;

    const [start, end] = getInitRange();
    setRange(label, start, end);

    const shiftRange = (direction) => {
        const [start, end] = getRange(label);

        let newEnd = end + direction * JUMP_LENGTH;
        let newStart = start + direction * JUMP_LENGTH;

        if (newStart <= MIN_VALUE) {
            setRange(label, MIN_VALUE, MIN_VALUE);
            return;
        }

        if (newStart === newEnd) {
            newStart = start
        }

        if (newEnd > MAX_VALUE) return;


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