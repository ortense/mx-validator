import { KV_COLLECTION, MAIL_EXCHANGER } from "../constants.ts";
import { handleMxResolveError, hasValidMxRecord } from "./pure.ts";
import type { MxResolveStatus, MxValidation } from "../types.ts";

export function getMxValidation(kv: Deno.Kv, domain: string) {
  return kv.get<MxValidation>([KV_COLLECTION, domain]);
}

export function setMxValidation(kv: Deno.Kv, mxValidation: MxValidation) {
  return kv.set([KV_COLLECTION, mxValidation.domain], mxValidation);
}

export function listMxValidation(kv: Deno.Kv) {
  return kv.list<MxValidation>({ prefix: [KV_COLLECTION] });
}

export function validateMX(domain: string): Promise<MxResolveStatus> {
  return Deno.resolveDns(domain, MAIL_EXCHANGER)
    .then(hasValidMxRecord)
    .catch(handleMxResolveError);
}

export function revalidateMX(kv: Deno.Kv, domain: string) {
  return validateMX(domain)
    .then((status) => {
      setMxValidation(kv, {
        domain,
        status,
        timestamp: new Date(),
      });
    })
    .catch(console.error);
}
