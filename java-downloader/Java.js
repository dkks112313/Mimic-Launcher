const Java = require('./Minecraft-Java')
const Minecraft_Json_js_1 = require("./Minecraft-Json.js");
const Downloader_js_1 = require("./Downloader.js");
const Minecraft_Bundle_js_1 = require("./Minecraft-Bundle.js");
const path = require("path");

async function downloadJava(path) {
    const defaultOptions = {
        url: null,
        authenticator: null,
        timeout: 10000,
        path: path,
        version: '1.16.5',
        instance: null,
        detached: false,
        intelEnabledMac: false,
        downloadFileMultiple: 5,
        loader: {
            path: './loader',
            type: null,
            build: 'latest',
            enable: false,
        },
        mcp: null,
        verify: false,
        ignored: [],
        JVM_ARGS: [],
        GAME_ARGS: [],
        java: {
            path: null,
            version: null,
            type: 'jre',
        },
        screen: {
            width: null,
            height: null,
            fullscreen: false,
        },
        memory: {
            min: '1G',
            max: '2G'
        }
    };

    let InfoVersion = await new Minecraft_Json_js_1.default(defaultOptions).GetInfoVersion();
    let { json, version } = InfoVersion;

    let java = new Java.default(defaultOptions);
    java.on('progress', (progress, size, element) => {
        this.emit('progress', progress, size, element);
    });
    java.on('extract', (progress) => {
        this.emit('extract', progress);
    });

    const gameJava = await java.getJavaFiles(json);

    let download = new Downloader_js_1.default()
    let bundle = new Minecraft_Bundle_js_1.default(defaultOptions);
    let filesList = await bundle.checkBundle([...gameJava.files]);
    let totsize = await bundle.getTotalSize(filesList);
    await download.downloadFileMultiple(filesList, totsize, defaultOptions.downloadFileMultiple, defaultOptions.timeout);
}

module.exports.downloadJava = downloadJava;
