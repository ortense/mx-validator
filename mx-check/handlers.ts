import { Context, Env } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import * as io from "./fns/io.ts";
import { mxStatusToHttpCode } from "./fns/pure.ts";
import type { MxValidation, RequestBody } from "./types.ts";

export function validate(kv: Deno.Kv) {
  return async (ctx: Context<Env, "/">) => {
    try {
      const { domain } = await ctx.req.json<RequestBody>();
      const { value } = await io.getMxValidation(kv, domain);

      if (value !== null) {
        ctx.status(mxStatusToHttpCode(value.status));
        return ctx.body(null);
      }

      const status = await io.validateMX(domain);
      const timestamp = new Date();

      io.setMxValidation(kv, { domain, status, timestamp });

      ctx.status(mxStatusToHttpCode(status));
      return ctx.body(null);
    } catch (error) {
      console.error(error);
      ctx.status(500);
      return ctx.json(error);
    }
  };
}

export function revalidate(kv: Deno.Kv) {
  return async () => {
    console.time("revalidate all domains");
    const entries = io.listMxValidation(kv);
    const revalidations: Promise<void>[] = [];

    for await (const entry of entries) {
      const { domain } = entry.value;
      revalidations.push(io.revalidateMX(kv, domain));
    }

    console.log(`revalidate ${revalidations.length} domains`);
    await Promise.all(revalidations);
    console.timeEnd("revalidate all domains");
  };
}

export function list(kv: Deno.Kv) {
  return async (ctx: Context<Env, "/">) => {
    const entries = io.listMxValidation(kv);
    const items: MxValidation[] = [];

    for await (const { value } of entries) {
      items.push(value);
    }

    return ctx.json({ total: items.length, items });
  };
}