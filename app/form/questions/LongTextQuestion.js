import {BaseQuestion} from "./BaseQuestion.js";

const FIELDS = {
    ANSWER: "answer"
};

export class LongTextQuestion extends BaseQuestion {

    constructor(data, pageTitle) {
        super(data, pageTitle);
        const defaultValue = this.data.defaultValue ?? '';
        this.defineField(FIELDS.ANSWER, defaultValue)
    }

    render() {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question', "vertical", this.data.type);
        questionDiv.innerHTML = `
        <label for="${this.id}">${this.title}</label>
        <textarea id="${this.id}"></textarea>
    `;
        this.textarea = questionDiv.querySelector('textarea');

        this.textarea.oninput = () => {
            this.setValue(this.textarea.value);
            this.setOutline(this.isValid());
            this.updateUI();
        };

        this.updateUI();
        requestAnimationFrame(() => this.resizeTextarea()); // ← deferred until in DOM
        return questionDiv;
    }

    resizeTextarea() {
        this.textarea.style.height = 'auto';
        this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    }

    updateUI() {
        this.textarea.value = this.getAnswer();
        this.resizeTextarea();

        const val = this.textarea.value.trim();
        this.textarea.dir = /^[\u0590-\u05FF\u0600-\u06FF]/.test(val) ? 'rtl' : 'ltr';
    }

    getAnswer() {
        return this.getField(FIELDS.ANSWER);
    }

    setValue(value) {
        this.setField(FIELDS.ANSWER, value);
    }

    isValid() {
        const value = this.getAnswer()?.trim();
        return !(this.required && !value);
    }

    clear() {
        this.setValue();
        this.updateUI();
    }

    focus() {
        this.textarea.scrollIntoView({block: 'center', inline: 'nearest'});
    }

    setOutline(isValid) {
        if (isValid) {
            this.textarea.classList.remove('invalid')
        } else {
            this.textarea.classList.add('invalid')
        }
    }
}