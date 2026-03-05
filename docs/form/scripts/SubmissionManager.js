import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../Storage.js";
import {SERVER_URL} from "../../config/Constants.js";

class SubmissionManager {

    constructor() {
        this.submitting = false;
        this.submissionQueue =
            getFromLocalStorage(LOCAL_STORAGE.SUBMISSION_QUEUE) || [];

        setInterval(() => this.processQueue(), 1000 * 60 * 5);
    }

    async addSubmission(submission) {

        const lifetimeSubmissions =
            getFromLocalStorage(LOCAL_STORAGE.LIFETIME_SUBMISSIONS) || [];
        lifetimeSubmissions.push(submission);

        setToLocalStorage(
            LOCAL_STORAGE.LIFETIME_SUBMISSIONS,
            lifetimeSubmissions
        )

        this.submissionQueue.push(submission);
        setToLocalStorage(
            LOCAL_STORAGE.SUBMISSION_QUEUE,
            this.submissionQueue
        );

        await this.processQueue();
    }

    async processQueue() {
        if (this.submitting) return;
        this.submitting = true;
        const form_id = getFromLocalStorage(LOCAL_STORAGE.CURRENT_FORM_ID)
        const form_version = getFromLocalStorage(LOCAL_STORAGE.CURRENT_FORM_VERSION)

        while (this.submissionQueue.length > 0) {
            const submission = this.submissionQueue[0];

            try {
                const response = await fetch(`${SERVER_URL}/upload-submission`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        form_id,
                        form_version,
                        submission
                    })
                });

                if (!response.ok) {
                    console.log("failed to submit")
                    this.submitting = false;
                    return
                }

                this.submissionQueue.shift();
                this.saveQueueToLocalStorage();
                console.log("Submitted successfully");

            } catch (error) {
                console.log("Submitting stopped");
                this.submitting = false;
                return
            }
        }

        if (this.submissionQueue.length === 0)
            console.log("Queue empty");
    }
}

export const submissionManager = new SubmissionManager();