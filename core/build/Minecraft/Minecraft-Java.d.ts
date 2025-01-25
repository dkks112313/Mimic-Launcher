// @ts-ignore
import EventEmitter from 'events';

export default class JavaDownloader extends EventEmitter {
    options: any;
    constructor(options: any);
    getJavaFiles(jsonversion: any): Promise<{
        error: boolean;
        message: string;
        files?: undefined;
        path?: undefined;
    } | {
        files: any[];
        path: string;
        error?: undefined;
        message?: undefined;
    }>;
    getJavaOther(jsonversion: any, versionDownload?: any): Promise<{
        error: boolean;
        message: string;
        files?: undefined;
        path?: undefined;
    } | {
        files: any[];
        path: string;
        error?: undefined;
        message?: undefined;
    }>;
    getPlatformArch(): {
        platform: any;
        arch: string;
    };
    verifyAndDownloadFile({ filePath, pathFolder, fileName, url, checksum, pathExtract }: {
        filePath: any;
        pathFolder: any;
        fileName: any;
        url: any;
        checksum: any;
        pathExtract: any;
    }): Promise<{
        error: boolean;
        message: string;
    }>;
    extract(filePath: any, destPath: any): Promise<unknown>;
}
