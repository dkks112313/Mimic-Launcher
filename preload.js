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
    openToPath: (channel, data) => {
        const validChannels = ['open-path-directory'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    sendToJava: (channel, data) => {
        const validChannels = ['select-path-java'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    sendDefaultPath: (channel, data) => {
        const validChannels = ['select-default-directory'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    sendDefaultJava: (channel, data) => {
        const validChannels = ['select-default-java'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    }
})

contextBridge.exposeInMainWorld('electronAPI', {
    onData: (callback) => ipcRenderer.on('config-load', callback),
    onPathDirectory: (callback) => ipcRenderer.on('select-html-path', callback),
    onPathJava: (callback) => ipcRenderer.on('select-html-java-path', callback),
    onDefaultPath: (callback) => ipcRenderer.on('select-default-html-path', callback),
    onDefaultJava: (callback) => ipcRenderer.on('select-default-html-java', callback),
    openToPathDefault: (callback) => ipcRenderer.on('select-html-java-path', callback),
    onConfigLoad: (callback) => ipcRenderer.on("config-load", (event, data) => callback(data)),
    sendSaveConfig: (updatedConfig) => ipcRenderer.send("update-config", updatedConfig),
});
