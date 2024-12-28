import { expectType } from "tsd";

expectType<Muse.Context>(context);

expectType<Muse.Devices>(context.devices);
expectType<<T = any>(name: string) => T>(context.devices.get);
expectType<(name: string) => boolean>(context.devices.has);
expectType<() => Array<string>>(context.devices.ids);

expectType<Muse.LogFunction & Muse.Log>(context.log);
expectType<Muse.LogLevel>(context.log.level);
expectType<Muse.LogFunction>(context.log.trace);
expectType<Muse.LogFunction>(context.log.debug);
expectType<Muse.LogFunction>(context.log.info);
expectType<Muse.LogFunction>(context.log.warn);
expectType<Muse.LogFunction>(context.log.error);

expectType<Muse.Services>(context.services);
expectType<<T = any>(name: string) => T>(context.services.get);

expectType<Muse.Export>(context.export);
expectType<<T = Record<string, any>>(path: string, args?: T) => void>(
    context.export.dispatch,
);
expectType<<T = any>(path: string, value: T, normalized?: number) => void>(
    context.export.update,
);
