const APP_ID = "qp"

/*
 probably remove the app id
 */

export const LOCAL_STORAGE = {
    SAVED_FORMS: 'savedForms',
    CURRENT_FORM_ID: 'currentFormId',
    CURRENT_FORM_VERSION: 'currentFormVersion',
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
    if (!value) return null;

    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

export function removeFromLocalStorage(key) {
    return localStorage.removeItem(APP_ID + key);
}

export function clearLocalStorage() {
    localStorage.clear();
}