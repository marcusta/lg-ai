import { db, isNewFile } from "./index";
import { migrate } from "./migrate";

(async () => {
  try {
    console.log("[db:migrate] Starting migration");
    migrate(db as any, { isNewFile });
    console.log("[db:migrate] Migration complete");
  } catch (err) {
    console.error("[db:migrate] Migration failed:", err);
    process.exitCode = 1;
  }
})();
