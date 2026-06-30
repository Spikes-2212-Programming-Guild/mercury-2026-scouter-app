import {BasePage} from "./BasePage.js";
import submissionManager from "../../form/SubmissionManager.js";

export class RecordsPage extends BasePage {

    _render() {
        this.container.innerHTML = `
            <div id="record-list" class="field"> 
                <button id="resend-button">Resend Submissions</button>
            </div>
        `
    }

    _generateRecords() {
        const records = submissionManager.getSubmissions()
        return Object.values(records).map(r => this._renderRecord(r)).join('');
    }

    /*

    maybe only generate the "actions" HTML when the button is pushed,
    so there aren't 100 useless HTML divs

     */
    _renderRecord(record) {
        return `
        <div class='record'>
            <div class="info">
                <label>${record.title}</label>
                <button class="info-button">▼</button>
            </div>
            <div class="actions" hidden>
                <button>[X]</button>
                <button>[QR]</button>
                <button>[EDIT]</button>
                <button>[SHOW]</button>
            </div>
        </div>
    `;
    }

    _queryElements() {

    }

    _attachEvents() {
        document.getElementById("resend-button").addEventListener("click", async () => {
            await submissionManager.uploadSubmissions();
        });

        /*
        add an "active" class to the current active
         */
        for (const record of this.container.querySelectorAll('.record')) {
            const infoButton = record.querySelector('.info-button')

            infoButton.onclick = () => {
                const actions = record.querySelector('.actions')

                if (actions.hidden) {
                    const old = this.container.querySelector('.actions:not([hidden])')
                    if (old) {
                        old.hidden = true
                    }

                    actions.hidden = false
                } else {
                    actions.hidden = true;
                }
            }
        }
    }

    _loadData() {

    }
}