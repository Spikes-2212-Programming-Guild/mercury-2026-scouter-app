import {getFromLocalStorage, isInLocalStorage, setToLocalStorage} from "../../../Storage.js";

export function renderTextArea(jsonQuestionData, questionContainer) {
    let textarea = document.getElementById(jsonQuestionData.id);
    if (textarea) {
        // clear
        textarea.value = '';
        setToLocalStorage(jsonQuestionData.id, textarea.value)
        return;
    }

    // skippable
    if (!isInLocalStorage(jsonQuestionData.id)) {
        setToLocalStorage(jsonQuestionData.id, '');
    }

    textarea = document.createElement('textarea');
    textarea.id = jsonQuestionData.id;
    textarea.value = getFromLocalStorage(jsonQuestionData.id) ?? '';
    textarea.oninput = () => {
        setToLocalStorage(jsonQuestionData.id, textarea.value)
        // adjust size based on amount of lines
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`

        const value = textarea.value.trim();

        if (/^[\u0590-\u05FF\u0600-\u06FF]/.test(value)) {
            textarea.dir = "rtl";
        } else {
            textarea.dir = "ltr";
        }

    };
    questionContainer.appendChild(textarea);
}
