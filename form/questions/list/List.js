import {getFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderList(jsonQuestionData, questionContainer) {
    const skippable = jsonQuestionData.skippable || false;
    const id = jsonQuestionData.id;

    const DEFAULT_VALUE = '[]'

    let select = document.getElementById(id);
    if (select) {

        if (!skippable) {
            select.value = null;
            setToLocalStorage(id, null)

        } else {
            select.value = DEFAULT_VALUE;
            setToLocalStorage(id, DEFAULT_VALUE)
        }

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
            const selected = Array.from(select.selectedOptions, o => o.value);
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