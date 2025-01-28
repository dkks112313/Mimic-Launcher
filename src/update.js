function updateConfigField(field, value) {
    const updatedConfig = {
        [field]: value
    };
    window.electronAPI.sendSaveConfig(updatedConfig);
}

document.getElementById('username').addEventListener('input', (event) => {
    updateConfigField('name', event.target.value);
});

document.getElementById('version').addEventListener('change', (event) => {
    updateConfigField('version', document.getElementById('version').options[document.getElementById('version').selectedIndex].text);
});

document.getElementById('modloader').addEventListener('change', (event) => {
    updateConfigField('mode', event.target.value);
    updateConfigField('version', 'latest');
});

document.getElementById('memory-input').addEventListener('input', (event) => {
    updateConfigField('ram', event.target.value);
});

document.getElementById('memory').addEventListener('input', (event) => {
    updateConfigField('ram', event.target.value);
});

document.getElementById('game-directory').addEventListener('input', (event) => {
    updateConfigField('path', event.target.value);
});

document.getElementById('java-path').addEventListener('input', (event) => {
    updateConfigField('java', event.target.value);
});

document.getElementById('jvm-arguments').addEventListener('input', (event) => {
    updateConfigField('jvm', event.target.value);
});

document.getElementById('language-select').addEventListener('change', (event) => {
    updateConfigField('language', event.target.value);
});

document.getElementById('auto-updates').addEventListener('change', (event) => {
    updateConfigField('update', event.target.checked);
});

document.getElementById('alpha-versions').addEventListener('change', (event) => {
    updateConfigField('alpha', event.target.checked);
});