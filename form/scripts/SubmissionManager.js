import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../Storage.js";
import {SERVER_URL} from "../../config/Constants.js";

/*

    TODO:
        maybe compress the submission json

 */

class SubmissionManager {

    constructor() {
        this.submitting = false;
        this.submissionQueue = getFromLocalStorage(LOCAL_STORAGE.SUBMISSION_QUEUE) || [];
        this.queueTimeout = null;

        setInterval(async () => {
            console.log("trying to resubmit");
            await this.processQueue();
        }, 1000 * 60 * 5);
    }

    async addSubmission(submission) {
        console.log('addSubmission', submission);

        // Store in lifetime submissions
        const lifetimeSubmissions = getFromLocalStorage(LOCAL_STORAGE.LIFETIME_SUBMISSIONS) || [];
        lifetimeSubmissions.push(submission);
        setToLocalStorage(LOCAL_STORAGE.LIFETIME_SUBMISSIONS, lifetimeSubmissions)

        // Add to the queue
        this.submissionQueue.push(submission);
        setToLocalStorage(LOCAL_STORAGE.SUBMISSION_QUEUE, this.submissionQueue);

        // Debounced processing to avoid overlapping calls
        if (!this.submitting) {
            clearTimeout(this.queueTimeout);
            this.queueTimeout = setTimeout(() => this.processQueue(), 50);
            // small delay to coalesce rapid submissions
        }
    }

    async processQueue() {
        if (this.submitting) return; // Prevent concurrent runs
        if (this.submissionQueue.length === 0) return; // Nothing to do

        this.submitting = true;
        const form_id = getFromLocalStorage(LOCAL_STORAGE.CURRENT_FORM_ID)
        const form_version = getFromLocalStorage(LOCAL_STORAGE.CURRENT_FORM_VERSION)

        while (this.submissionQueue.length > 0) {
            const submission = this.submissionQueue[0];

            try {
                const response = await fetch(`${SERVER_URL}/upload-submission`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({form_id, form_version, submission})
                });

                if (!response.ok) {
                    console.warn("Submission failed, will retry later:", submission);
                    break;
                }

                // Success: remove from queue
                this.submissionQueue.shift();
                setToLocalStorage(LOCAL_STORAGE.SUBMISSION_QUEUE, this.submissionQueue);
                console.log("Submitted successfully:", submission);

            } catch (error) {
                console.error("Error submitting, will retry later:", error);
                break;
            }
        }

        this.submitting = false;
    }
}

export const submissionManager = new SubmissionManager();