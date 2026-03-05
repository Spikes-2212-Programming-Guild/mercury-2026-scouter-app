import {getFromLocalStorage, removeFromLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderAutoComplete(jsonQuestionData, questionContainer) {
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

        datalist.append(option1);
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