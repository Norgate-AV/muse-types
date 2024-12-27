export {};

declare global {
    var global: typeof globalThis;
    var context: Muse.Context;

    /**
     * The Mojo Universal Scripting Engine (MUSE) contains a framework for communicating with AMX devices,
     * modules, and other AMX specific facilities: the Thing API.
     */
    namespace Muse {
        /**
         * Context is the handle for the Mojo engine. It has logging and device access features.
         */
        interface Context {
            devices: Devices;
            log: ((msg: any) => void) & Log;
            services: Services;
        }

        // type Thing = Context;

        interface Devices {
            /**
             * Get a specific device by its name
             * @param name The ID of the device
             * @returns The device object or undefined if not found
             */
            get<T = any>(name: string): T | "null";

            /**
             * Check if a specific device is defined
             * @param name The ID of the device
             * @returns true if the device is defined, false otherwise
             */
            has(name: string): boolean;

            /**
             * Get the list of defined devices
             * @returns An array of device IDs
             */
            ids(): Array<string>;
        }

        type MuseLogLevel = "TRACE" | "DEBUG" | "INFO" | "WARNING" | "ERROR";

        interface Log {
            /**
             * Set/Get the current logging threshold
             */
            level: MuseLogLevel;

            /**
             * Issue a log message at TRACE level
             * @param msg The message to log
             * @returns void
             */
            trace(msg: any): void;

            /**
             * Issue a log message at DEBUG level
             * @param msg The message to log
             * @returns void
             */
            debug(msg: any): void;

            /**
             * Issue a log message at INFO level
             * @param msg The message to log
             * @returns void
             */
            info(msg: any): void;

            /**
             * Issue a log message at WARNING level
             * @param msg The message to log
             * @returns void
             */
            warn(msg: any): void;

            /**
             * Issue a log message at ERROR level
             * @param msg The message to log
             * @returns void
             */
            error(msg: any): void;
        }

        interface Services {
            /**
             * Get a service by name
             * @param name The name of the service
             * @returns The service object or undefined if not found
             */
            get<T = any>(name: string): T | undefined;
        }

        type MuseProvider = "groovy" | "javascript" | "python";

        type ProgramManifest = {
            id: string;
            name?: string | undefined;
            description?: string | undefined;
            version?: string | undefined;
            disabled: boolean;
            provider: MuseProvider;
            scope?: string | undefined;
            script: string;
            envvars?: Record<string, string> | undefined;
            files?: Array<string> | undefined;
            plugins?: Array<string> | undefined;
        };

        type TimelineService = {
            start: (
                intervals: Array<number>,
                relative: boolean,
                repeat: number,
            ) => void;

            stop: () => void;
            pause: () => void;
            restart: () => void;

            expired: {
                listen: (callback: Muse.TimelineEventCallback) => void;
            };
        };

        type TimelineEventCallback = (event?: TimelineEvent) => void;

        type TimelineEvent = BaseEvent & {
            arguments: {
                data: object;
                sequence: number;
                time: number;
                repetition: number;
            };
        };

        interface BaseEvent {
            /**
             * The propery of the device that this event refers to
             */
            path: string;

            /**
             * A shortened version path. For ICSP, only the button number is conveyed
             */
            id: string;

            /**
             *
             */
            arguments: {
                data: object;
            };
            oldValue: object;
            source: object;
        }

        type PlatformService = {
            venue: string;
            serialnumber: string;
            devicestate: string;
            name: string;
            description: string;
            location: string;
            model: string;
            label: string;
            family: string;
            version: string;
            manufacturer: string;
        };

        type ICSPDriver = {
            configuration: ICSPConfiguration;
            port: Array<ICSPPort>;
            online: (callback: ICSPOnlineOfflineCallback) => void;
            offline: (callback: ICSPOnlineOfflineCallback) => void;
            isOnline: () => boolean;
            isOffline: () => boolean;
        };

        type ICSPOnlineOfflineCallback = () => void;

        type ICSPConfiguration = {
            device: ISCPDevice;
        };

        type ISCPDevice = {
            classname: Readonly<string>;
            container: Readonly<string>;
            description: Readonly<string>;
            descriptorlocation: Readonly<string>;
            devicestate: Readonly<string>;
            family: Readonly<string>;
            guid: Readonly<string>;
            location: Readonly<string>;
            manufacturer: Readonly<string>;
            model: Readonly<string>;
            name: Readonly<string>;
            protocolversion: Readonly<string>;
            serialnumber: Readonly<string>;
            softwareversion: Readonly<string>;
            venue: Readonly<string>;
            version: Readonly<string>;
        };

        type ICSPEvent = {
            data: string;
        };

        type ICSPCustomEvent = ICSPEvent & {
            encode: string;
            flag: number;
            value1: number;
            value2: number;
            value3: number;
            id: number;
            type: number;
        };

        type ICSPEventCallback = (event: ICSPEvent) => void;
        type ICSPCustomEventCallback = (event: ICSPCustomEvent) => void;
        type ICSPParameterUpdateCallback<T = any> = (
            event: ParameterUpdate<T>,
        ) => void;

        type ICSPPort = {
            button: Array<Readonly<ICSPButton>>;
            channel: Array<boolean & ICSPChannel>;
            command: (callback: ICSPEventCallback) => void;
            custom: (callback: ICSPCustomEventCallback) => void;
            level: Array<number & ICSPLevel>;
            send_command: (data: string) => void;
            send_string: (data: string) => void;
            string: (callback: ICSPEventCallback) => void;
        };

        type ICSPButton = {
            watch: (callback: ICSPParameterUpdateCallback<boolean>) => void;
        };

        type ICSPChannel = {
            watch: (callback: ICSPParameterUpdateCallback<boolean>) => void;
        };

        type ICSPLevel = {
            watch: (callback: ICSPParameterUpdateCallback<number>) => void;
        };

        type Parameter = {
            value: string;
            normalized: number;
            min: number;
            max: number;
            defaultValue: string;
            type: string;
            enums: Array<string>;
        };

        type ParameterUpdate<T = any> = {
            path: string;
            id: string;
            value: T;
            newValue: T;
            oldValue: T;
            normalized: number;
            source: object;
        };
    }
}
