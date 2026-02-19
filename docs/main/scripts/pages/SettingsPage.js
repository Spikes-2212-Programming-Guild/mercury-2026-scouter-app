export class SettingsPage {

    render(container) {

        const components = [
            {title: 'thing', description: "more things"},
            {title: 'thing1', description: "more things1"}
        ]

        for (const setting of components) {
            container.append(this.renderSingleSetting(setting));
        }
    }

    renderSingleSetting({ title, description }) {

        const componentDiv = document.createElement('div');
        componentDiv.classList.add('settings-component');

        const componentTitle = document.createElement('label');
        componentTitle.innerHTML = title;

        const componentDescription = document.createElement('p');
        componentDescription.innerHTML = description;

        componentDiv.append(componentTitle, componentDescription)
        return componentDiv;
    }
}
