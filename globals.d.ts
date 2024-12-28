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
            log: LogFunction & Log;
            services: Services;
            export: Export;
        }

        interface Devices {
            /**
             * Get a specific device by its name
             *
             * @template T The type of the device object
             *
             * @param {string} name The ID of the device
             *
             * @returns {T} The device object
             */
            get<T = any>(name: string): T;

            /**
             * Check if a specific device is defined
             *
             * @param {string} name The ID of the device
             *
             * @returns {boolean} true if the device is defined, false otherwise
             */
            has(name: string): boolean;

            /**
             * Get the list of defined devices
             *
             * @returns {Array<string>} An array of device IDs
             */
            ids(): Array<string>;
        }

        type LogLevel = "TRACE" | "DEBUG" | "INFO" | "WARNING" | "ERROR";

        type LogFunction = (msg: any) => void;

        interface Log {
            /**
             * Set/Get the current logging threshold
             */
            level: LogLevel;

            /**
             * Issue a log message at TRACE level
             *
             * @param {any} msg The message to log
             *
             * @returns {void} void
             */
            trace(msg: any): void;

            /**
             * Issue a log message at DEBUG level
             *
             * @param {any} msg The message to log
             *
             * @returns {void} void
             */
            debug(msg: any): void;

            /**
             * Issue a log message at INFO level
             *
             * @param {any} msg The message to log
             *
             * @returns {void} void
             */
            info(msg: any): void;

            /**
             * Issue a log message at WARNING level
             *
             * @param {any} msg The message to log
             *
             * @returns {void} void
             */
            warn(msg: any): void;

            /**
             * Issue a log message at ERROR level
             *
             * @param {any} msg The message to log
             *
             * @returns {void} void
             */
            error(msg: any): void;
        }

        interface Services {
            /**
             * Get a service by name
             *
             * @template T The type of the service object
             *
             * @param {string} name The name of the service
             *
             * @returns {T} The service object
             */
            get<T = any>(name: string): T;
        }

        interface Export {
            /**
             * Allows a script to generate events
             *
             * @param {string} path The path of the event in the descriptor
             * @param {Record<string, any>} [args] Map of key-value pairs representing the arguments of the event that will be generated
             *
             * @returns {void} void
             */
            dispatch<T = Record<string, any>>(path: string, args?: T): void;

            /**
             * Allows a script to update the value of a parameter. When updated, any listeners to
             * that parameter will automatically be updated with the new value
             *
             * @template T The type of the parameter value
             *
             * @param {string} path The path of the parameter that is being updated
             * @param {T} value The new value of the parameter
             * @param {number} [normalized] The normalized value of the parameter
             *
             * @returns {void} void
             */
            update<T = any>(path: string, value: T, normalized?: number): void;
        }

        /**
         * Any callback or lambda functions for a .listen passed the event structure.
         * This contains the specific information that triggered the event.
         */
        interface Event<T = any> {
            /**
             * The property of the device that this event refers to
             */
            path: string;

            /**
             * A shortened version path. For ICSP, only the button number is conveyed
             */
            id: string;

            /**
             * The data payload of the event, dependent on the specific event
             */
            arguments: object;

            /**
             * The data value before the event was processed
             */
            oldValue: T;

            /**
             * The object reference for the specific parameter that was updated
             */
            source: string;
        }

        /**
         * The *Timeline* service provides a mechanism for triggering events based on a sequence of times. The sequence of times is pass the *start* function as an array of integer values, with each value representing a time period, in milliseconds, that is either an offset the start of the timeline or relative to the previously triggered event.
         *
         * Each call into the context's service requests returns a new instance of a timeline.
         *
         * @example JavaScript
         * ```javascript
         * const timeline = context.services.get("timeline");
         *
         * // Start the timeline with a sequence of times
         * // The timeline will trigger events at 1000ms, 2000ms, and 3000ms
         * // The timeline will not repeat
         * timeline.start([1000, 2000, 3000], false, 0);
         *
         * // Listen for events from the timeline
         * timeline.expired.listen((event) => {
         *      context.log(`Time: ${event.arguments.time}`);
         *      context.log(`Repetition: ${event.arguments.repetition}`);
         *      context.log(`Sequence: ${event.arguments.sequence}`);
         * });
         *
         * // Stop the timeline
         * timeline.stop();
         * ```
         *
         * @example TypeScript
         * ```typescript
         * const timeline = context.services.get<Muse.TimelineService>("timeline");
         *
         * // Start the timeline with a sequence of times
         * // The timeline will trigger events each 1000ms
         * // The timeline will repeat forever
         * timeline.start([1000], false, -1);
         *
         * // Listen for events from the timeline
         * timeline.expired.listen((event) => {
         *     context.log(`Time: ${event.arguments.time}`);
         *     context.log(`Repetition: ${event.arguments.repetition}`);
         *     context.log(`Sequence: ${event.arguments.sequence}`);
         * });
         *
         * // Stop the timeline
         * timeline.stop();
         * ```
         */
        interface TimelineService {
            /**
             * Starts the timeline
             *
             * @param {Array<number>} intervals Array of time intervals in milliseconds
             * @param {boolean} [relative = false] If there multiple times in the array, it determines whether the timings are treated as relative delays between triggers, or as an independent list of times that may trigger out of sequence relative to the order in the list.
             * @param {number} [repeat = 0] A value of -1 indicates that the timeline should run forever. A timeline started with a value of 0 will run once. The value indicates the number of repetitions.
             *
             * @returns {void} void
             */
            start(
                intervals: Array<number>,
                relative?: boolean,
                repeat?: number,
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
                 *
                 * @param {Function} callback The function that will be called when the timer expires
                 */
                listen(callback: TimelineEventCallback): void;
            };
        }

        interface TimelineEvent extends Event {
            arguments: {
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

        namespace Program {
            /**
             * Programming Language
             */
            type Provider = "groovy" | "javascript" | "python";

            /**
             * A MUSE program descriptor file
             */
            interface ProgramFile {
                /**
                 * Globally unique program ID, special characters are not allowed
                 */
                id: string;

                /**
                 * A description of the program that may be used by user interfaces
                 */
                description?: string;

                /**
                 * Disable the auto-start of the script on system boot
                 *
                 * @default false
                 */
                disabled?: boolean;

                /**
                 * Name/Value pairs that can be used to set configuration of a program
                 */
                envvars?: Record<string, string>;

                /**
                 * The scope (location) to which the script belongs. Leave blank for global scope
                 */
                scope?: string;

                /**
                 * The language the program is written in
                 */
                provider: Provider;

                /**
                 * The file name of the main entry point of the program
                 *
                 * @default "index.<extension>"
                 */
                script?: string;
            }

            // Extended Program File. Perhaps should not be here?
            interface ExtendedProgramFile extends ProgramFile {
                /**
                 * Friendly name of the program
                 */
                name?: string;

                /**
                 * The version of the program
                 */
                version?: string;

                /**
                 * The author of the program
                 */
                author?: string;

                /**
                 * An array of file paths that should be included in the program
                 */
                files?: Array<string>;

                /**
                 * An array of file paths that will be dynamically loaded
                 */
                plugins?: Array<string>;
            }
        }

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
            devicestate: Readonly<string>;

            /**
             * A string containing the platform location
             */
            location: Readonly<string>;

            /**
             * A string containing the platform name
             */
            name: Readonly<string>;

            /**
             * A string containing the platform version
             */
            version: Readonly<string>;

            /**
             * A string containing the platform venue
             */
            venue: Readonly<string>;

            /**
             * A string containing the platform description
             */
            description: Readonly<string>;

            /**
             * A string containing the platform serial number
             */
            serialnumber: Readonly<string>;

            /**
             * A string containing the platform family
             */
            family: Readonly<string>;

            /**
             * A string containing the platform manufacturer
             */
            manufacturer: Readonly<string>;

            /**
             * A string containing the platform model
             */
            model: Readonly<string>;

            /**
             * A string containing the platform label
             */
            label: Readonly<string>;
        }

        interface DiagnosticService {}

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
                password?: string,
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

            /**
             *
             * @param username
             * @param password
             */
            login(username: string, password: string): void;

            /**
             *
             * @param username
             */
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
                tls: boolean,
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
                fileName?: string,
            ): void;
        }

        namespace ICSP {
            interface Driver {
                configuration: Configuration;
                port: Array<Port>;

                /**
                 * Receive online events from the ICSP driver
                 *
                 * @param {Function} callback The function that will be called when the device comes online
                 *
                 * @returns {void} void
                 */
                online(callback: OnlineOfflineCallback): void;

                /**
                 * Receive offline events from the ICSP driver
                 *
                 * @param {Function} callback The function that will be called when the device goes offline
                 *
                 * @returns {void} void
                 */
                offline(callback: OnlineOfflineCallback): void;

                /**
                 * Get the current online status of the device
                 *
                 * @returns {boolean} true if the device is online, false otherwise
                 */
                isOnline(): boolean;

                /**
                 * Get the current offline status of the device
                 *
                 * @returns {boolean} true if the device is offline, false otherwise
                 */
                isOffline(): boolean;
            }

            type OnlineOfflineCallback = () => void;

            interface Configuration {
                device: Device;
            }

            interface Device {
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

            interface Event {
                data: string;
            }

            interface CustomEvent extends Event {
                encode: string;
                flag: number;
                value1: number;
                value2: number;
                value3: number;
                id: number;
                type: number;
            }

            type EventCallback = (event?: Event) => void;
            type CustomEventCallback = (event?: CustomEvent) => void;
            type ParameterUpdateCallback<T = any> = (
                event?: ParameterUpdate<T>,
            ) => void;

            interface Port {
                button: Array<Readonly<Button>>;
                channel: Array<boolean & Channel>;
                command(callback: EventCallback): void;
                custom(callback: CustomEventCallback): void;
                level: Array<number & Level>;
                send_command(data: string): void;
                send_string(data: string): void;
                string(callback: EventCallback): void;
            }

            interface Button {
                watch(callback: ParameterUpdateCallback<boolean>): void;
            }

            interface Channel {
                watch(callback: ParameterUpdateCallback<boolean>): void;
            }

            interface Level {
                watch(callback: ParameterUpdateCallback<number>): void;
            }
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

        /**
         * Any callback or lambda functions for a .watch() attached to a parameter is passed this structure.
         * This contains the specific information that triggered the parameter change event.
         *
         * @template T The type of the parameter value
         */
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

        namespace IDevice {
            interface SerialPort {}
            interface RelayPort {}
            interface IRPort {}
            interface IOPort {}
        }

        namespace LED {}
    }
}
