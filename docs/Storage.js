const APP_ID = "qp"

export const LOCAL_STORAGE = {
    FORMS: 'forms',
    FORM_ID: 'formId',
    FORM_DATA: 'formData',
    FORM_VERSION: 'formVersion',
    PAGE_ID: 'pageId',
    PAGE_INDEX: 'pageIndex',
    CURRENT_APP: 'currentApp',
    SUBMISSION_QUEUE: 'submissionQueue',
    LIFETIME_SUBMISSIONS: 'lifetimeSubmissions',
    COLOR_THEME_INDEX: 'colorThemeIndex',
};

export function setToLocalStorage(key, value) {
    localStorage.setItem(APP_ID + key, JSON.stringify(value));
}

export function getFromLocalStorage(key) {
    const value = localStorage.getItem(APP_ID + key);
    return value ? JSON.parse(value) : null;
}

export function removeFromLocalStorage(key) {
    return localStorage.removeItem(APP_ID + key);
}

export function clearLocalStorage() {
    localStorage.clear();
}