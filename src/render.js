document.getElementById("exit-btn").addEventListener("click", function(event) {
    if (window.electron) {
        event.preventDefault();
        window.electronAPI.exitButton();
    } else {
        console.error('window.electron is undefined')
    }
});

document.getElementById('launch-btn').addEventListener('click', () => {
    const name = document.getElementById('username').value
    let version = document.getElementById('version')
    let selectedMode = document.getElementById('modloader')
    let jvmArguments = document.getElementById('jvm-arguments').value

    const ram = document.getElementById('memory').value
    const pathDirectory = document.getElementById('game-directory').value
    const javaPaths = document.getElementById('java-path').value

    version = version.options[version.selectedIndex].text
    selectedMode = selectedMode.options[selectedMode.selectedIndex].text

    if (window.electron) {
        window.electron.sendToMain('play-button-clicked', { name, version, selectedMode, ram, pathDirectory, javaPaths, jvmArguments })
    } else {
        console.error('window.electron is undefined')
    }
})

document.getElementById('game-directory-select').addEventListener('click', () => {
    if (window.electron) {
        window.electron.sendToPath('select-path-directory', {})
    } else {
        console.error("window.electron is undefined")
    }
    console.log("Select game directory clicked")
})

document.getElementById('game-directory-default').addEventListener('click', () => {
    if (window.electron) {
        window.electron.sendDefaultPath('select-default-directory', {})
    } else {
        console.error("window.electron is undefined")
    }
    document.getElementById('game-directory').value = ''
})

document.getElementById('game-directory-open').addEventListener('click', () => {
    const path = document.getElementById('game-directory').value
    if (window.electron) {
        window.electron.openToPathDefault('open-path-directory', {path: path})
    } else {
        console.error("window.electron is undefined")
    }
    console.log("Select game directory clicked")
})

document.getElementById('java-path-select').addEventListener('click', () => {
    if (window.electron) {
        window.electron.sendToJava('select-path-java', {})
    } else {
        console.error("window.electron is undefined")
    }
    console.log("Select game directory clicked")
})

document.getElementById('java-path-default').addEventListener('click', () => {
    if (window.electron) {
        window.electron.sendDefaultJava('select-default-java', {})
    } else {
        console.error("window.electron is undefined")
    }
    document.getElementById('java-path').value = ''
})

if (window.electron) {
    window.electron.onFromMain('progress-update', (progress) => {
        console.log(`Progress update: ${progress}%`)
    })
} else {
    console.error("window.electron is undefined")
}
