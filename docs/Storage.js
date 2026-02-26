const APP_ID = "qp"

export const LOCAL_STORAGE = {
    FORM_ID: 'formId',
    FORM_DATA: 'formData',
    FORM_VERSION: 'formVersion',
    PAGE_ID: 'pageId',
    PAGE_INDEX: 'pageIndex',
    CURRENT_APP: 'currentApp',
    SUBMISSION_QUEUE: 'submissionQueue',
    LIFETIME_SUBMISSIONS: 'lifetimeSubmissions',
};

export function setToLocalStorage(key, value) {
    localStorage.setItem(APP_ID + key, value);
}

export function getFromLocalStorage(key) {
    return localStorage.getItem(APP_ID + key);
}

export function removeFromLocalStorage(key) {
    return localStorage.removeItem(APP_ID + key);
}

export function clearLocalStorage() {
    localStorage.clear();
}