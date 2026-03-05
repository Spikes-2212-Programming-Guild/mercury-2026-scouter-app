import {getFromLocalStorage, LOCAL_STORAGE} from "../../../Storage.js";

export class RecordsPage {

    render(container) {
        this.submissions = getFromLocalStorage(LOCAL_STORAGE.LIFETIME_SUBMISSIONS) || [];

        console.log(this.submissions);

        const submissionContainer = document.createElement('div')
        container.append(submissionContainer)

        for (const submission of this.submissions) {
            this.renderSubmission(submissionContainer, submission)
        }
    }

    renderSubmission(container, submission) {

        const title = document.createElement('label')
        title.textContent = JSON.stringify(submission)

        container.append(title)
    }
}
