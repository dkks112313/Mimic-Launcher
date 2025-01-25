document.getElementById('launch-btn').addEventListener('click', () => {
    const name = document.getElementById('username').value
    let version = document.getElementById('version')
    let selectedMode = document.getElementById('modloader')

    const ram = document.getElementById('memory').value

    version = version.options[version.selectedIndex].text
    selectedMode = selectedMode.options[selectedMode.selectedIndex].text

    if (window.electron) {
        window.electron.sendToMain('play-button-clicked', { name, version, selectedMode, ram })
    } else {
        console.error("window.electron is undefined")
    }
})

if (window.electron) {
    window.electron.onFromMain('progress-update', (progress) => {
        console.log(`Progress update: ${progress}%`)
    })
} else {
    console.error("window.electron is undefined")
}
