function updateConfigField(field, value) {
    const updatedConfig = {
        [field]: value
    };
    window.electronAPI.sendSaveConfig(updatedConfig);
}

window.electronAPI.onDefaultPath((event, data) => {
    updateConfigField('path', data.path);
})

window.electronAPI.onDefaultJava((event, data) => {
    updateConfigField('java', data.path);
})

window.electronAPI.onData((event, data) => {
    console.log('Данные из Node:', data.message)
})

window.electronAPI.onPathDirectory((event, data) => {
    if(data.path !== undefined) {
        document.getElementById('game-directory').value = data.path
        updateConfigField('path', data.path);
    }
})

window.electronAPI.onPathJava((event, data) => {
    if(data.path !== undefined) {
        document.getElementById('java-path').value = data.path
        updateConfigField('java', data.path);
    }
})

window.electronAPI.onConfigLoad((config) => {
    document.getElementById("username").value = config.core.name;
    document.getElementById("modloader").value = config.core.mode;

    document.getElementById("memory-input").value = config.core.ram;
    document.getElementById("memory").value = config.core.ram;
    document.getElementById("memory-value").textContent = config.core.ram + ' GB';

    document.getElementById("game-directory").value = config.core.path;
    document.getElementById("java-path").value = config.core.java;
    document.getElementById("jvm-arguments").value = config.core.jvm;

    document.getElementById("language-select").value = config.core.language;
    updateLanguage(config.core.language);

    document.getElementById("auto-updates").checked = config.core.update;
    document.getElementById("alpha-versions").checked = config.core.alpha;

    changeFunction(config.core.version);
});