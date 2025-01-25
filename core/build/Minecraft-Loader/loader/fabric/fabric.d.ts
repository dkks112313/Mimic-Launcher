import { EventEmitter } from 'events';
export default class FabricMC extends EventEmitter {
    options: any;
    constructor(options?: {});
    downloadJson(Loader: any): Promise<any>;
    downloadLibraries(json: any): Promise<any>;
}
