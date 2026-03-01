import {getFromLocalStorage, LOCAL_STORAGE} from "../../../Storage.js";

export class RecordsPage {

    render(container) {
        this.submissionQueue = JSON.parse(
            getFromLocalStorage(LOCAL_STORAGE.SUBMISSION_QUEUE)) || [];

        const submissionContainer = document.createElement('div')
        container.append(submissionContainer)

        for (const submission of this.submissionQueue) {
            this.renderSubmission(submissionContainer, submission)
        }
    }

    renderSubmission(container, submission) {

        const title = document.createElement('label')
        title.textContent = JSON.stringify(submission)

        container.append(title)
    }
}
