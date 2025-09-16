import { db, isNewFile } from "./index";
import { migrate } from "./migrate";
import { seed } from "./seed";

(async () => {
  try {
    console.log("[db:seed] Running migration first (idempotent)");
    migrate(db as any, { isNewFile });
    seed(db as any);
    console.log("[db:seed] Seed complete");
  } catch (err) {
    console.error("[db:seed] Seed failed:", err);
    process.exitCode = 1;
  }
})();
