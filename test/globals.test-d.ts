import { expectType } from "tsd";
import "../index";

expectType<Muse.Context>(context);
expectType<Muse.Devices>(context.devices);
expectType<Muse.Log>(context.log);
expectType<Muse.Services>(context.services);
