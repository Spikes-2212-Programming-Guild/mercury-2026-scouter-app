import {StorageModule} from "../util/StorageModule.js";

const FIELDS = {
    QUEUE: 'queue',
    LIFETIME: 'lifetime',
};

const RETRY_INTERVAL_MS = 1000 * 60 * 5;
const DEBOUNCE_MS = 50;
const SERVER_URL = "https://mercury-2026-server.onrender.com"

class SubmissionManager extends StorageModule {

    constructor() {
        super('submissionManager');
        this.defineField(FIELDS.QUEUE, []);
        this.defineField(FIELDS.LIFETIME, []);

        this.submitting = false;
        this.queueTimeout = null;

        setInterval(() => {
            console.log("Retrying queue...");
            this.processQueue();
        }, RETRY_INTERVAL_MS);
    }

    async addSubmission(answers) {
        console.log('addSubmission', answers);

        // persist to lifetime log (never removed)
        const lifetime = this.getLifetime();
        lifetime.push(answers);
        this.setField(FIELDS.LIFETIME, lifetime);

        // enqueue for upload
        const queue = this.getQueue();
        queue.push(answers);
        this.setField(FIELDS.QUEUE, queue);

        // debounce so rapid submissions coalesce into one upload pass
        if (!this.submitting) {
            clearTimeout(this.queueTimeout);
            this.queueTimeout = setTimeout(() => this.processQueue(), DEBOUNCE_MS);
        }
    }

    getSubmissions() {
        return this.getLifetime();
    }

    async uploadSubmissions() {
        await this.processQueue();
    }

    // TODO: implement QR / bluetooth transfer
    // transferSubmission(submission) {
    // }

    async processQueue() {
        if (this.submitting) return;
        if (!this.getQueue().length) return;

        this.submitting = true;

        while (this.getQueue().length > 0) {
            const queue = this.getQueue();
            const submission = queue[0];

            try {
                const response = await fetch(`${SERVER_URL}/upload-submission`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(submission),
                });

                if (!response.ok) {
                    console.warn("Upload failed, will retry later:", submission);
                    break;
                }

                queue.shift();
                this.setField(FIELDS.QUEUE, queue);
                console.log("Uploaded successfully:", submission);

            } catch (error) {
                console.error("Upload error, will retry later:", error);
                break;
            }
        }

        this.submitting = false;
    }

    getQueue() {
        return this.getField(FIELDS.QUEUE);
    }

    getLifetime() {
        return this.getField(FIELDS.LIFETIME);
    }
}

const submissionManager = new SubmissionManager();
export default submissionManager;