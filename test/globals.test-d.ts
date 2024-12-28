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
