import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import { validate, revalidate, list } from "./mx-check/handlers.ts";
import { EVERY_DAY_AT_MIDNIGHT, JOB_NAME } from "./mx-check/constants.ts";

const kv = await Deno.openKv();
const app = new Hono();

app.post("/", validate(kv)).get('/', list(kv));
Deno.cron(JOB_NAME, EVERY_DAY_AT_MIDNIGHT, revalidate(kv));
Deno.serve(app.fetch);
