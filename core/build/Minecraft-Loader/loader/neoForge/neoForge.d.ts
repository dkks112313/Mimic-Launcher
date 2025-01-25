import { EventEmitter } from 'events';
export default class NeoForgeMC extends EventEmitter {
    options: any;
    constructor(options?: {});
    downloadInstaller(Loader: any): Promise<{
        error: string;
        filePath?: undefined;
        oldAPI?: undefined;
    } | {
        filePath: string;
        oldAPI: boolean;
        error?: undefined;
    }>;
    extractProfile(pathInstaller: any): Promise<any>;
    extractUniversalJar(profile: any, pathInstaller: any, oldAPI: any): Promise<boolean>;
    downloadLibraries(profile: any, skipneoForgeFilter: any): Promise<any>;
    patchneoForge(profile: any, oldAPI: any): Promise<boolean>;
}
