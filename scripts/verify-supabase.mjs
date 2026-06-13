import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.log("MISSING_ENV");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.from("orders").select("id").limit(1);

if (!error) {
  console.log("ORDERS_TABLE_OK");
  process.exit(0);
}

if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
  console.log("ORDERS_TABLE_MISSING");
  process.exit(2);
}

console.log("SUPABASE_ERROR", error.message);
process.exit(3);
