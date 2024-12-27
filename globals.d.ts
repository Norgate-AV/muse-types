export {};

declare global {
    var global: typeof globalThis;

    /**
     * Context is the handle for the Mojo engine. It has logging and device access features.
     */
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

        interface Devices {
            /**
             * Get a specific device by its name
             * @param name The ID of the device
             * @returns The device object or undefined if not found
             */
            get<T = any>(name: string): T;

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

        type LogLevel = "TRACE" | "DEBUG" | "INFO" | "WARNING" | "ERROR";

        interface Log {
            /**
             * Set/Get the current logging threshold
             */
            level: LogLevel;

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
            get<T = any>(name: string): T;
        }

        interface Event {
            /**
             * The propery of the device that this event refers to
             */
            path: string;

            /**
             * A shortened version path. For ICSP, only the button number is conveyed
             */
            id: string;

            /**
             * The data payload of the event, dependent on the specific event
             */
            arguments: {
                data: object;
            };

            /**
             * The data value before the event was processed
             */
            oldValue: object;

            /**
             * The object reference for the specific parameter that was updated
             */
            source: object;
        }

        interface TimelineService {
            /**
             * Starts the timeline
             * @param intervals Array of time intervals in milliseconds
             * @param relative If there multiple times in the array, it determines whether the timings are treated as relative delays berween triggers, or as an independent list of times that may trigger out of seuence relative to the order in the list.
             * @param repeat A value of -1 indicates that the timeline should run forever. A timeline started with a value of 0 will run once. The value indicates the number of repetitions.
             * @returns void
             */
            start(
                intervals: Array<number>,
                relative: boolean,
                repeat: number,
            ): void;

            /**
             * Stops the timeline
             */
            stop(): void;

            /**
             * Pauses the timeline
             */
            pause(): void;

            /**
             * Resumes the timeline from a paused state
             */
            restart(): void;

            expired: {
                /**
                 * Receive events from the timeline
                 * @param callback The function that will be called when the timer expires
                 */
                listen(callback: TimelineEventCallback): void;
            };
        }

        interface TimelineEvent extends Event {
            arguments: {
                data: object;

                /**
                 * The sequence number of the event
                 */
                sequence: number;

                /**
                 * The time in milliseconds when the event was triggered
                 */
                time: number;

                /**
                 * The number of times the event has been triggered
                 */
                repetition: number;
            };
        }

        type TimelineEventCallback = (event?: TimelineEvent) => void;

        type Provider = "groovy" | "javascript" | "python";

        type ProgramManifest = {
            id: string;
            name?: string | undefined;
            description?: string | undefined;
            version?: string | undefined;
            disabled: boolean;
            provider: Provider;
            scope?: string | undefined;
            script: string;
            envvars?: Record<string, string> | undefined;
            files?: Array<string> | undefined;
            plugins?: Array<string> | undefined;
        };

        interface PlatformService {
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
        }

        interface DiagnosticsService {}
        interface NetLinxClientService {}
        interface SessionService {}

        interface SmtpService {
            /**
             * Set the configuration for the SMTP service
             * @param domain The domain of the SMTP server
             * @param username The username to authenticate with
             * @param password The password to authenticate with
             * @param name The name of the sender
             * @param port The port to connect to
             * @param tls Whether to use TLS
             * @returns void
             */
            setConfig(
                domain: string,
                username: string,
                password: string,
                name: string,
                port: number,
                tls: boolean,
            ): void;

            /**
             * Get the current configuration of the SMTP service
             * @returns The current configuration
             */
            getConfig(): unknown;

            /**
             * Clear the current configuration of the SMTP service
             * @returns void
             */
            clearConfig(): void;

            /**
             * Send an email
             * @param address The email address to send to
             * @param name The name of the recipient
             * @param subject The subject of the email
             * @param body The body of the email
             * @param attachment The attachment to include
             * @param fileName The name of the attachment
             * @returns void
             */
            sendEmail(
                address: string,
                name: string,
                subject: string,
                body: string,
                attachment: string,
                fileName: string,
            ): void;
        }

        interface ICSPDriver {
            configuration: ICSPConfiguration;
            port: Array<ICSPPort>;
            online: (callback: ICSPOnlineOfflineCallback) => void;
            offline: (callback: ICSPOnlineOfflineCallback) => void;
            isOnline: () => boolean;
            isOffline: () => boolean;
        }

        type ICSPOnlineOfflineCallback = () => void;

        type ICSPConfiguration = {
            device: ISCPDevice;
        };

        interface ISCPDevice {
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
        }

        interface ICSPEvent {
            data: string;
        }

        interface ICSPCustomEvent extends ICSPEvent {
            encode: string;
            flag: number;
            value1: number;
            value2: number;
            value3: number;
            id: number;
            type: number;
        }

        type ICSPEventCallback = (event: ICSPEvent) => void;
        type ICSPCustomEventCallback = (event: ICSPCustomEvent) => void;
        type ICSPParameterUpdateCallback<T = any> = (
            event: ParameterUpdate<T>,
        ) => void;

        interface ICSPPort {
            button: Array<Readonly<ICSPButton>>;
            channel: Array<boolean & ICSPChannel>;
            command(callback: ICSPEventCallback): void;
            custom(callback: ICSPCustomEventCallback): void;
            level: Array<number & ICSPLevel>;
            send_command(data: string): void;
            send_string(data: string): void;
            string(callback: ICSPEventCallback): void;
        }

        interface ICSPButton {
            watch(callback: ICSPParameterUpdateCallback<boolean>): void;
        }

        interface ICSPChannel {
            watch(callback: ICSPParameterUpdateCallback<boolean>): void;
        }

        interface ICSPLevel {
            watch(callback: ICSPParameterUpdateCallback<number>): void;
        }

        interface Parameter<T = any> {
            /**
             * The new value which caused the parameter change callback
             */
            value: string;

            /**
             * A float value between 0 and 1, inclusive, based on the value's range
             */
            normalized: number;

            /**
             * The minimum value of a numerical parameter
             */
            min: T;

            /**
             * The maximum value of a numerical parameter
             */
            max: T;

            /**
             * The default value of a parameter
             */
            defaultValue: T;

            /**
             * The data type of this specific parameter
             */
            type: number;

            /**
             * For an enumeration, the specific data points available
             */
            enums: Array<string>;
        }

        interface ParameterUpdate<T = any> {
            /**
             * The specific parameter that has been updated
             */
            path: string;

            /**
             * The last element of the path
             */
            id: string;

            /**
             * The current value of the parameter
             */
            value: T;

            /**
             * The current value of the parameter
             */
            newValue: T;

            /**
             * The previous value of the parameter
             */
            oldValue: T;

            /**
             * A float value between 0 and 1, inclusive, based on the range of the value
             */
            normalized: number;

            /**
             * The object reference for the specific parameter that was updated
             */
            source: object;
        }
    }
}
