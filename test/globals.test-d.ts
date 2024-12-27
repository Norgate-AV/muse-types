import { expectType } from "tsd";

expectType<Muse.Context>(context);
expectType<Muse.Devices>(context.devices);
expectType<Muse.Log>(context.log);
expectType<Muse.Services>(context.services);
