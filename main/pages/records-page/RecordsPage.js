import {getFromLocalStorage, LOCAL_STORAGE} from "../../../Storage.js";
import {submissionManager} from "../../../form/scripts/SubmissionManager.js";

export class RecordsPage {

    render(container) {
        this.submissions = getFromLocalStorage(LOCAL_STORAGE.LIFETIME_SUBMISSIONS) || [];

        // console.log(this.submissions);

        this.renderRetryButton(container);

        const submissionContainer = document.createElement('div')
        container.append(submissionContainer)

        for (const submission of this.submissions) {
            this.renderSubmission(submissionContainer, submission)
        }
    }

    renderRetryButton(container) {
        const button = document.createElement('button');
        button.textContent = 'Retry submitting';
        button.onclick = async () => submissionManager.processQueue();
        container.append(button);
    }

    renderSubmission(container, submission) {

        const title = document.createElement('label')
        title.textContent = JSON.stringify(submission)

        container.append(title)
    }
}
