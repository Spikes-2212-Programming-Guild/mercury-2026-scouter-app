import {BaseQuestion} from "./BaseQuestion.js";

const FIELDS = {
    ANSWER: "answer"
};

export class ListQuestion extends BaseQuestion {

    constructor(data, pageTitle) {
        super(data, pageTitle);
        const defaultValue = this.data.defaultValue ?? null;
        this.defineField(FIELDS.ANSWER, defaultValue)
    }

    render() {
        const questionDiv = document.createElement('div');
        // const isMultiple = Boolean(this.data.multiple); multiple=${isMultiple}

        questionDiv.classList.add('question', "vertical", this.data.type);
        questionDiv.innerHTML = `
            <label for="${this.id}">${this.title}</label>
            <select size=1 id="${this.id}">
        `;
        this.select = questionDiv.querySelector('select')

        for (const c of this.data.choices) {
            const option = document.createElement('option');
            option.id = this.id + '-' + c;
            option.textContent = c;
            option.value = c;
            this.select.appendChild(option);
        }

        this.select.onchange = () => {
            this.setValue(this.select.value)
            this.setOutline(this.isValid())
        };

        this.updateUI();
        return questionDiv;
    }

    updateUI() {
        this.select.value = this.getAnswer();
    }

    getAnswer() {
        return this.getField(FIELDS.ANSWER);
    }

    setValue(value) {
        this.setField(FIELDS.ANSWER, value);
    }

    isValid() {
        const value = this.getAnswer() !== null
        return !(this.required && !value);
    }

    clear() {
        this.setValue();
        this.updateUI();
    }

    focus() {
        this.select.scrollIntoView({block: 'center', inline: 'nearest'});
    }

    setOutline(isValid) {
        if (isValid) {
            this.select.classList.remove('invalid')
        } else {
            this.select.classList.add('invalid')
        }
    }
}