import {BaseQuestion} from "./BaseQuestion.js";

const FIELDS = {
    ANSWER: "answer"
};

export class AutoCompleteQuestion extends BaseQuestion {

    constructor(data, pageTitle) {
        super(data, pageTitle);
        const defaultValue = this.data.defaultValue ?? null;
        this.defineField(FIELDS.ANSWER, defaultValue)
    }

    render() {
        const questionDiv = document.createElement('div');

        questionDiv.classList.add('question', "vertical", this.data.type);
        questionDiv.innerHTML = `
            <label for="${this.id}">${this.title}</label>
            <input type="text" id="${this.id}">
            <datalist></datalist>
        `;
        this.input = questionDiv.querySelector('input')
        const datalist = questionDiv.querySelector('datalist')

        datalist.id = this.id + '-list';
        for (const c of this.data.choices) {
            const option1 = document.createElement('option');
            option1.value = c.value;
            option1.label = c.description

            const option2 = document.createElement('option');
            option2.value = c.value;
            option2.label = c.value

            datalist.append(option1, option2);
        }
        this.input.setAttribute('list', datalist.id)

        this.input.onchange = () => {
            this.setValue(this.input.value.trim())
            this.setOutline(this.isValid())
        };

        this.updateUI();
        return questionDiv;
    }

    updateUI() {
        this.input.value = this.getAnswer();
    }

    getAnswer() {
        return this.getField(FIELDS.ANSWER);
    }

    setValue(value) {
        this.setField(FIELDS.ANSWER, value);
    }

    isValid() {
        const allowedValues = new Set(this.data.choices.map(c => String(c.value).trim()));
        const value = allowedValues.has(this.getAnswer())
        return !(this.required && !value);
    }

    clear() {
        this.setValue();
        this.updateUI();
    }

    focus() {
        this.input.scrollIntoView({block: 'center', inline: 'nearest'});
    }

    setOutline(isValid) {
        if (isValid) {
            this.input.classList.remove('invalid')
        } else {
            this.input.classList.add('invalid')
        }
    }
}