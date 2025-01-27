const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    sendToMain: (channel, data) => {
        const validChannels = ['play-button-clicked'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },

    onFromMain: (channel, callback) => {
        const validChannels = ['progress-update'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => callback(...args))
        }
    },

    sendToPath: (channel, data) => {
        const validChannels = ['select-path-directory'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },

    sendToJava: (channel, data) => {
        const validChannels = ['select-path-java'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    }
})

contextBridge.exposeInMainWorld('electronAPI', {
    onData: (callback) => ipcRenderer.on('data-from-node', callback), // Подключаем обработчик событий
    onPathDirectory: (callback) => ipcRenderer.on('select-html-path', callback),
    onPathJava: (callback) => ipcRenderer.on('select-html-java-path', callback)
});
