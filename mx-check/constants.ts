import type { MxResolveStatus } from "./types.ts";

export const MX_RESOLVE_STATUS = {
  FOUND: "FOUND",
  NOTFOUND: "NOTFOUND",
  INVALID: "INVALID",
} as const;

export const NOTFOUND = "NotFound";

export const STATUS_MAP: Record<MxResolveStatus, number> = {
  [MX_RESOLVE_STATUS.FOUND]: 204,
  [MX_RESOLVE_STATUS.INVALID]: 400,
  [MX_RESOLVE_STATUS.NOTFOUND]: 404,
} as const;

export const KV_COLLECTION = "domains";
export const MAIL_EXCHANGER = "MX";
export const JOB_NAME = "Revalidate MX";
export const EVERY_DAY_AT_MIDNIGHT = "0 0 * * *";
