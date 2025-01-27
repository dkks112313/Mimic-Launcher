const {app, BrowserWindow, ipcMain, dialog} = require("electron")
const ProgressBar = require("electron-progressbar")

const {Client, Authenticator} = require("minecraft-launcher-core")
const {Launch, Mojang} = require("core")
const {forge} = require("tomate-loaders")

const path = require("path")
const fs = require("fs")
const {downloadJava} = require("./java-downloader/Java")

dialog.showErrorBox = () => {};

let win

const createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    win.loadFile('src/index.html')
    win.setMenuBarVisibility(false)

    win.webContents.send('data-from-node', {message: 'Hi, HTML!'})
}

async function openFolderDialog(channel) {
    let selected_dir

    await dialog
        .showOpenDialog(win, {
            title: 'Choice path',
            properties: ['openDirectory'],
        })
        .then((result) => {
            if (!result.canceled) {
                selected_dir = result.filePaths[0]
            }
        })
        .catch((err) => {
            console.error('Ошибка при открытии диалога:', err)
        })
        .finally((err) => {
            win.webContents.send(channel, {path: selected_dir})
        })
}

app.whenReady().then(() => {
    createWindow()
})

ipcMain.on('select-path-directory', async (event, data) => {
    await openFolderDialog('select-html-path')
})

ipcMain.on('select-path-java', async (event, data) => {
    await openFolderDialog('select-html-java-path')
})

ipcMain.on('play-button-clicked', (event, data) => {
    const params = {
        name: data.name,
        version: data.version,
        mode: data.selectedMode,
        ram: data.ram,
        path: data.pathDirectory,
        java: data.javaPaths
    }

    const launch_toml = new Client()
    const launch_json = new Launch()

    let pathToDir, folderPath, pathJava
    if (params['path'] === undefined || params['path'] === '') {
        pathToDir = path.resolve('./Minecraft')
        folderPath = path.join(pathToDir)

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath)
        }
    } else {
        pathToDir = params['path']
        folderPath = path.join(pathToDir)
    }

    if (params['java'] === undefined || params['java'] === '') {
        params['java'] = null
    }

    let progressBar = new ProgressBar({
        text: 'Preparing data...',
        detail: 'Waiting...',
        style: {
            text: {
                'font-weight': 'bold',
                'color': '#ffffff'
            },
            detail: {
                'color': '#ffffff'
            },
            bar: {
                'background': '#4caf50'
            },
            value: {
                'background': '#23631e'
            }
        },
        browserWindow: {
            width: 500,
            backgroundColor: '#18191a'
        }
    })

    progressBar
        .on('completed', function () {
            console.info(`completed...`)
            progressBar.detail = 'Task completed. Exiting...'
        })
        .on('aborted', function () {
            console.info(`aborted...`)
        })

    function find_jre() {
        const path_jre = `${path.join(folderPath, 'runtime')}`
        if (!fs.existsSync(path_jre)) {
            fs.mkdirSync(path_jre)
        }

        let files = fs.readdirSync(path_jre)

        for (let file of files) {
            if (file.startsWith('jre')) {
                return file
            }
        }

        return ''
    }

    async function launchTask(progressBar) {
        let mode = null
        let enables = false

        if (params['mode'] !== 'Vanilla') {
            mode = params['mode'].toLowerCase()
            enables = true
        }

        if (params['java'] === null) {
            params['java'] = null
        } else {
            params['java'] = path.join(params['java'], 'bin', 'java')
        }

        let option = {
            authenticator: await Mojang.login(params['name']),
            path: folderPath,
            version: params['version'],
            loader: {
                path: '',
                type: mode,
                build: 'latest',
                enable: enables,
            },
            JVM_ARGS: [],
            GAME_ARGS: [],
            java: {
                path: params['java'],
                version: null,
                type: 'jre',
            },
            screen: {
                width: null,
                height: null,
                fullscreen: false,
            },
            memory: {
                min: params['ram'] + 'G',
                max: params['ram'] + 'G'
            },
        }

        async function extracted() {
            if (params['version'] === '1.16.5') {
                option.JVM_ARGS = ['-Dminecraft.api.env=custom',
                    '-Dminecraft.api.auth.host=https://invalid.invalid/',
                    '-Dminecraft.api.account.host=https://invalid.invalid/',
                    '-Dminecraft.api.session.host=https://invalid.invalid/',
                    '-Dminecraft.api.services.host=https://invalid.invalid/']
            }

            await launch_json.Launch(option)

            launch_json.on('extract', extract => {
                console.log(extract)
            })

            launch_json.on('progress', (progress, size, element) => {
                console.log(`Downloading ${element} ${Math.round((progress / size) * 100)}%`)
            })

            launch_json.on('check', (progress, size, element) => {
                console.log(`Checking ${element} ${Math.round((progress / size) * 100)}%`)
            })

            launch_json.on('estimated', (time) => {
                let hours = Math.floor(time / 3600)
                let minutes = Math.floor((time - hours * 3600) / 60)
                let seconds = Math.floor(time - hours * 3600 - minutes * 60)

                console.log(`${hours}h ${minutes}m ${seconds}s`)
            })

            launch_json.on('speed', (speed) => {
                console.log(`${(speed / 1067008).toFixed(2)} Mb/s`)
            })

            launch_json.on('patch', patch => {
                console.log(patch)
            })

            launch_json.on('data', (e) => {
                progressBar._window.hide()
                console.log(e)
            })

            launch_json.on('close', code => {
                progressBar.setCompleted()
                console.log(code)
            })

            launch_json.on('error', err => {
                console.error = () => {};
            })
        }

        async function task() {
            if (find_jre() === '') {
                await downloadJava(folderPath)
            }

            const version = path.join(folderPath, 'versions', params['version'])

            if (fs.existsSync(version)) {
                fs.rm(version, {recursive: true}, (err) => {
                    console.log('Dir, delete')
                })
            }

            forge.getMCLCLaunchConfig({
                gameVersion: params['version'],
                rootPath: folderPath,
            })

            let pathToJavas
            if (params['java'] === null) {
                pathToJavas = path.join(folderPath, 'runtime', find_jre(), 'bin', 'java')
            } else {
                pathToJavas = params['java']
            }

            await launch_toml.launch({
                authorization: Authenticator.getAuth(params['name']),
                root: folderPath,
                version: {
                    number: params['version'],
                    type: 'release'
                },
                memory: {
                    max: params['ram'] + 'G',
                    min: params['ram'] + 'G'
                },
                overrides: {
                    detached: false
                },
                fw: {
                    version: '1.6.0'
                },
                forge: path.join(folderPath, 'versions', 'forge-1.16.5', 'forge.jar'),
                javaPath: pathToJavas,
                customArgs: ['-Dminecraft.api.env=custom',
                    '-Dminecraft.api.auth.host=https://invalid.invalid/',
                    '-Dminecraft.api.account.host=https://invalid.invalid/',
                    '-Dminecraft.api.session.host=https://invalid.invalid/',
                    '-Dminecraft.api.services.host=https://invalid.invalid/']
            })

            launch_toml.on('debug', (e) => console.log(e))
            launch_toml.on('data', (e) => {
                progressBar._window.hide()
                console.log(e)
            })
            launch_toml.on('close', (e) => {
                progressBar.setCompleted()
                console.log(e)
            })
        }

        if (['1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.15.2'].includes(params['version']) && params['mode'] === 'Forge') {
            await task()
        } else {
            await extracted()
        }
    }

    launchTask(progressBar)
})
