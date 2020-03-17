import { restProvider } from "./rest";
import { realTimeProvider } from "./realtime";
import { client } from "./client";

export const dataProvider = restProvider(client);
export const realTimeSaga = realTimeProvider(dataProvider);
