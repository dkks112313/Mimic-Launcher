// QULIT - https://meta.quiltmc.org/v3/versions/game
// FORGE - https://maven.minecraftforge.net/net/minecraftforge/forge/maven-metadata.xml
// FABRIC - https://meta.fabricmc.net/v2/versions/game
// NEOFORGE - https://maven.neoforged.net/mojang-meta/net/neoforged/minecraft-dependencies/maven-metadata.xml
const version_list = document.getElementById('version');

/*fetch('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json')
    .then(r => r.json())
    .then(names => {
        let namesContains = names['versions'];
        for (let i = 0; i < namesContains.length; i++) {
            let newOption = new Option(namesContains[i]['id'], namesContains[i]['type']);
            version_list.append(newOption);
        }
    });*/

function removeSelectedOptions() {
    let selectElement = document.getElementById("version");
    let options = selectElement.options;

    for (let i = options.length - 1; i >= 0; i--) {
        selectElement.remove(i);
    }
}

function changeFunction() {
    removeSelectedOptions()

    switch (document.getElementById('modloader').options[document.getElementById('modloader').selectedIndex].text) {
        case 'Vanilla':
            fetch('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json')
                .then(response => response.json())
                .then(names => {
                    let namesContains = names['versions'];
                    for (let i = 0; i < namesContains.length; i++) {
                        let newOption = new Option(namesContains[i]['id'], namesContains[i]['type']);
                        version_list.append(newOption);
                    }
                });
            break;
        case 'Forge':
            fetch('https://maven.minecraftforge.net/net/minecraftforge/forge/maven-metadata.xml')
                .then(response => response.text())
                .then(str => new window.DOMParser().parseFromString(str, "application/xml"))
                .then(xmlDOM => {
                    const set = new Set()
                    const xpathResult = xmlDOM.evaluate("//version", xmlDOM, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    for (let i = 0; i < xpathResult.snapshotLength; i++) {
                        const versionElement = xpathResult.snapshotItem(i);
                        set.add(versionElement.textContent.trim().split('-')[0]);
                    }

                    set.forEach(version => {
                        let newOption = new Option(version, version);
                        version_list.appendChild(newOption);
                    });
                });
            break;
        case 'Fabric':
            fetch('https://meta.fabricmc.net/v2/versions/game')
                .then(response => response.json())
                .then(names => {
                    for (let i = 0; i < names.length; i++) {
                        let newOption = new Option(names[i]['version'], i);
                        version_list.append(newOption);
                    }
                });
            break;
        case 'Quilt':
            fetch('https://meta.quiltmc.org/v3/versions/game')
                .then(response => response.json())
                .then(names => {
                    for (let i = 0; i < names.length; i++) {
                        let newOption = new Option(names[i]['version'], i);
                        version_list.append(newOption);
                    }
                });
            break;
        case 'NeoForge':
            const versions = [];

            fetch('https://maven.neoforged.net/mojang-meta/net/neoforged/minecraft-dependencies/maven-metadata.xml')
                .then(response => response.text())
                .then(str => new window.DOMParser().parseFromString(str, "application/xml"))
                .then(xmlDOM => {
                    const xpathResult = xmlDOM.evaluate("//version", xmlDOM, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    for (let i = 0; i < xpathResult.snapshotLength; i++) {
                        const versionElement = xpathResult.snapshotItem(i);
                        versions[i] = versionElement.textContent.trim();
                    }

                    function filterVersions(versions) {
                        const filteredVersions = versions.filter(version => {
                            return !version.includes('pre') && !version.includes('rc') && !version.includes('w') && version !== "1.20";
                        });

                        const validVersions = filteredVersions.filter(version => {
                            const versionParts = version.split('.');
                            const targetVersion = "1.20.2".split('.');

                            for (let i = 0; i < versionParts.length; i++) {
                                if (parseInt(versionParts[i]) < parseInt(targetVersion[i])) {
                                    return false;
                                } else if (parseInt(versionParts[i]) > parseInt(targetVersion[i])) {
                                    return true;
                                }
                            }

                            return version === "1.20.2";
                        });

                        validVersions.sort((a, b) => b.localeCompare(a));

                        return validVersions;
                    }

                    const finalVersions = filterVersions(versions);

                    finalVersions.forEach((version) => {
                        let newOption = new Option(version, version);
                        version_list.appendChild(newOption);
                    })
                });
            break;
    }
}
