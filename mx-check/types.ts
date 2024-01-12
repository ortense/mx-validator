import { MX_RESOLVE_STATUS } from "./constants.ts";

export type MxResolveStatus = keyof typeof MX_RESOLVE_STATUS;

export type MxValidation = {
  domain: string;
  status: MxResolveStatus;
  timestamp: Date;
};

export type MxRecord = Deno.MXRecord;

export type RequestBody = { domain: string };
