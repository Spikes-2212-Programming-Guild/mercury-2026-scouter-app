/*

this class should include a submission queue

1. it should try to send the forms every X minutes
2. it should have an "add form" method
3.

 */


import {getFromLocalStorage, LOCAL_STORAGE, setToLocalStorage} from "../../Storage.js";
import {SERVER_URL} from "../config/Constants.js";

export class SubmissionManager {

    constructor() {
        this.submitting = false;
        this.submissionQueue =
            JSON.parse(getFromLocalStorage(LOCAL_STORAGE.SUBMISSION_QUEUE)) || [];

        setInterval(() => this.processQueue(), 1000 * 60);
    }

    saveQueue() {

        setToLocalStorage(
            LOCAL_STORAGE.SUBMISSION_QUEUE,
            JSON.stringify(this.submissionQueue)
        );
    }

    async addSubmission(submission) {
        this.submissionQueue.push(submission);
        this.saveQueue();
        await this.processQueue();
    }

    async processQueue() {
        if (this.submitting) return;
        this.submitting = true;
        const form_id = getFromLocalStorage(LOCAL_STORAGE.FORM_ID)
        const form_version = getFromLocalStorage(LOCAL_STORAGE.FORM_VERSION)

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
                this.saveQueue();
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