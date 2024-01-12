import { MX_RESOLVE_STATUS, NOTFOUND, STATUS_MAP } from "../constants.ts";
import type { MxRecord, MxResolveStatus } from "../types.ts";

export function isNotFoundError(value: unknown) {
  if (!(value instanceof Error)) return false;
  if (value.name != NOTFOUND) return false;
  return true;
}

export function validMxRecord(record: MxRecord) {
  return Boolean(record.exchange) && Boolean(record.preference);
}

export function hasValidMxRecord(records: MxRecord[]) {
  return records.some(validMxRecord)
    ? MX_RESOLVE_STATUS.FOUND
    : MX_RESOLVE_STATUS.INVALID;
}

export function handleMxResolveError(error: unknown) {
  return isNotFoundError(error)
    ? Promise.resolve(MX_RESOLVE_STATUS.NOTFOUND)
    : Promise.reject(error);
}

export function mxStatusToHttpCode(status: MxResolveStatus) {
  return STATUS_MAP[status];
}
