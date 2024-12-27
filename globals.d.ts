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

        /**
         * The *Timeline* service provides a mechanism for triggering events based on a sequence of times. The sequence of times is pass the *start* function as an array of integer values, with each value representing a time period, in milliseconds, that is either an offset the start of the timeline or relative to the previously triggered event.
         *
         * Each call into the context's service requests returns a new instance of a timeline.
         */
        interface TimelineService {
            /**
             * Starts the timeline
             *
             * @param {Array<number>} intervals Array of time intervals in milliseconds
             * @param {boolean} [relative = false] If there multiple times in the array, it determines whether the timings are treated as relative delays berween triggers, or as an independent list of times that may trigger out of seuence relative to the order in the list.
             * @param {number} [repeat = 0] A value of -1 indicates that the timeline should run forever. A timeline started with a value of 0 will run once. The value indicates the number of repetitions.
             *
             * @returns {void} void
             */
            start(
                intervals: Array<number>,
                relative?: boolean,
                repeat?: number
            ): void;

            /**
             * Stops the timeline
             *
             * @returns {void} void
             */
            stop(): void;

            /**
             * Pauses the timeline
             *
             * @returns {void} void
             */
            pause(): void;

            /**
             * Resumes the timeline from a paused state
             *
             * @returns {void} void
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

        /**
         * The *Platform* service provides a mechanism to read platform parameters such as model and version.
         *
         * @example JavaScript
         * ```javascript
         * const platform = context.services.get("platform");
         *
         * context.log(`Device State: ${platform.devicestate}`);
         * context.log(`Location: ${platform.location}`);
         * context.log(`Name: ${platform.name}`);
         * context.log(`Version: ${platform.version}`);
         * context.log(`Venue: ${platform.venue}`);
         * context.log(`Description: ${platform.description}`);
         * context.log(`Serial Number: ${platform.serialnumber}`);
         * context.log(`Family: ${platform.family}`);
         * context.log(`Manufacturer: ${platform.manufacturer}`);
         * context.log(`Model: ${platform.model}`);
         * context.log(`Label: ${platform.label}`);
         * ```
         * @example TypeScript
         * ```typescript
         * const platform = context.services.get<Muse.PlatformService>("platform");
         *
         * context.log(`Device State: ${platform.devicestate}`);
         * context.log(`Location: ${platform.location}`);
         * context.log(`Name: ${platform.name}`);
         * context.log(`Version: ${platform.version}`);
         * context.log(`Venue: ${platform.venue}`);
         * context.log(`Description: ${platform.description}`);
         * context.log(`Serial Number: ${platform.serialnumber}`);
         * context.log(`Family: ${platform.family}`);
         * context.log(`Manufacturer: ${platform.manufacturer}`);
         * context.log(`Model: ${platform.model}`);
         * context.log(`Label: ${platform.label}`);
         * ```
         */
        interface PlatformService {
            /**
             * A string containing the current platform state. ex. "Running"
             */
            devicestate: string;

            /**
             * A string containing the platform location
             */
            location: string;

            /**
             * A string containing the platform name
             */
            name: string;

            /**
             * A string containing the platform version
             */
            version: string;

            /**
             * A string containing the platform venue
             */
            venue: string;

            /**
             * A string congaining the platform description
             */
            description: string;

            /**
             * A string containing the platform serial number
             */
            serialnumber: string;

            /**
             * A string containing the platform family
             */
            family: string;

            /**
             * A string containing the platform manufacturer
             */
            manufacturer: string;

            /**
             * A string containing the platform model
             */
            model: string;

            /**
             * A string containing the platform label
             */
            label: string;
        }

        interface DiagnosticsService {}

        /**
         * The *NetLinxClient* service provides a mechanism for scripting language to communicate with a legacy NX controller.
         */
        interface NetLinxClientService {
            online: {
                listen(callback: () => void): void;
            };
            offline: {
                listen(callback: () => void): void;
            };
            string: {
                listen(callback: () => void): void;
            };
            command: {
                listen(callback: () => void): void;
            };

            /**
             * Initiates a connection to NetLinx Controller
             *
             * @param {string} host A string containing the destination NetLinx Controller IP address or hostname
             * @param {number} device A integer containing the local ICSP device number to report to remote controller
             * @param {string} [username] A string containing the username used for ICSP authentication
             * @param {string} [password] A string containing the password used for ICSP authentication
             *
             * @returns {void} void
             */
            connect(
                host: string,
                device: number,
                username?: string,
                password?: string
            ): void;

            /**
             * Closes a connection to a NetLinx Controller
             *
             * @returns {void} void
             */
            disconnect(): void;

            /**
             * Sends a command to the device
             *
             * @param {string} data The command to send
             *
             * @returns {void} void
             */
            send_command(data: string): void;

            /**
             * Sends a string to the device
             *
             * @param {string} data The string to send
             *
             * @returns {void} void
             */
            send_string(data: string): void;
        }

        /**
         * The *Session* service provides a mechanism for authenticating users  from within a script.
         *
         * Each call into the context's service requests returns the same, single instance of SessionService.
         */
        interface SessionService {
            onLogin: {
                listen(callback: (event?: SessionLoginEvent) => void): void;
            };
            onLogout: {
                listen(callback: (event?: SessionLogoutEvent) => void): void;
            };
            login(username: string, password: string): void;
            logout(username: string): void;
        }

        interface SessionLogoutEvent {
            username: string;
        }

        interface SessionLoginEvent extends SessionLogoutEvent {
            status: boolean;
            statusMsg: string;
            permissions: string;
        }

        interface SmtpService {
            /**
             * Set the configuration for the SMTP service
             *
             * @param {string} domain The domain of the SMTP server
             * @param {string} username The username to authenticate with
             * @param {string} password The password to authenticate with
             * @param {string} name The name of the sender
             * @param {number} port The port to connect to
             * @param {boolean} tls Whether to use TLS
             *
             * @returns {void} void
             */
            setConfig(
                domain: string,
                username: string,
                password: string,
                name: string,
                port: number,
                tls: boolean
            ): void;

            /**
             * Get the current configuration of the SMTP service
             *
             * @returns {unknown} The current configuration
             */
            getConfig(): unknown;

            /**
             * Clear the current configuration of the SMTP service
             *
             * @returns {void} void
             */
            clearConfig(): void;

            /**
             * Sends an email
             *
             * @param {string} address The email address to send to
             * @param {string} name The name of the recipient
             * @param {string} subject The subject of the email
             * @param {string} body The body of the email
             * @param {string} [attachment] The attachment to include
             * @param {string} [fileName] The name of the attachment
             *
             * @returns {void} void
             */
            sendEmail(
                address: string,
                name: string,
                subject: string,
                body: string,
                attachment?: string,
                fileName?: string
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
            event: ParameterUpdate<T>
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
