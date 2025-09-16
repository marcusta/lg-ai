import crypto from "crypto";
import { nowIso } from "../config";
import { db, withTx, type DB } from "./index";

interface SeedTodo {
  title: string;
  description?: string;
  status?: string;
  priority?: number;
  dueAt?: string | null;
  tags?: string[];
}

// NOTE: Svenska seed-todos. Underpunkter hopslagna till description med radbrytningar. Totalt 7 poster.
const seedTodos: SeedTodo[] = [
  {
    title: "1. Lägg till en ny route: /kanban",
    description: [
      "* Ska gå att nå från toppnivå-navigeringen",
      "* Ska visa tre kolumner och alla kort i varje kolumn",
    ].join("\n"),
    priority: 1,
    tags: ["kanban", "routing", "layout"],
  },
  {
    title:
      "2. Utsmycka UI:t med customkomponenter som visar relevant information",
    description: [
      "* Antal komponenter i varje lane",
      "* Tags, due date och prio i varje komponent",
      "Se till att customkomponenterna hamnar i en egen folder",
    ].join("\n"),
    priority: 1,
    tags: ["ui", "design", "metadata"],
  },
  {
    title: "3. Implementera drag-and-drop",
    description: "* Se till att göra UI:t intuitivt",
    priority: 2,
    tags: ["kanban", "dnd", "ux"],
  },
  {
    title: "4. Implementera filter för kolumner",
    description: [
      "* Gör det först per kolumn",
      "* Ändra dig och gör det för alla todos istället",
      "* Se till att det går att filtrera på olika saker, att det går att se att ett filter är påslaget och att det går enkelt att reset:a filtret",
    ].join("\n"),
    priority: 2,
    tags: ["filters", "kanban", "ux"],
  },
  {
    title: "5. Gör det möjligt att editera kort genom att klicka på dem",
    priority: 2,
    tags: ["kanban", "editing"],
  },
  {
    title: "6. Authentication",
    description: [
      "* Implementera authentication för backend",
      "* Implementera loginskärm för icke-inloggade användare",
    ].join("\n"),
    priority: 3,
    tags: ["auth"],
  },
  {
    title: "7. Lägg till användare",
    description: ["* Tabell i db", "* Repo", "* Route"].join("\n"),
    priority: 3,
    tags: ["users"],
  },
];

export function seed(database: DB = db) {
  console.log("Seeding DB");
  withTx(() => {
    const insertTodo = database.prepare(
      `INSERT INTO todos (id,title,description,status,priority,due_at,created_at,updated_at,version) VALUES (?,?,?,?,?,?,?,?,1)`
    );
    const insertTag = database.prepare(
      `INSERT INTO todo_tags (todo_id, tag) VALUES (?,?)`
    );
    for (const t of seedTodos) {
      const now = nowIso();
      const id = crypto.randomUUID();
      console.log("inserting todo: ", t.title);
      insertTodo.run(
        id,
        t.title,
        t.description ?? null,
        t.status ?? "todo",
        t.priority ?? 3,
        t.dueAt ?? null,
        now,
        now
      );
      if (t.tags) t.tags.forEach((tag) => insertTag.run(id, tag));
    }
  });
}
