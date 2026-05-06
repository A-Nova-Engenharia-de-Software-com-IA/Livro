import { createClient, type Client } from "@libsql/client";
import { randomUUID } from "crypto";

export const DB_URL = "file:/Users/rafaelscheidt/foka/projects/personal/flutter-aula/estudos/Livro/controlz-burguer/database/mastra.db";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  variations?: string[];
  active: boolean;
  createdAt: string;
}

let _db: Client | null = null;
let _ready: Promise<void> | null = null;

function getDb(): Client {
  if (!_db) _db = createClient({ url: DB_URL });
  return _db;
}

async function ensureTable(): Promise<void> {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      price      REAL NOT NULL,
      category   TEXT NOT NULL,
      variations TEXT,
      active     INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    )
  `);
  const { rows } = await db.execute("SELECT COUNT(*) as count FROM products");
  if (Number(rows[0].count) === 0) {
    await seedProducts(db);
  }
}

function ready(): Promise<void> {
  if (!_ready) _ready = ensureTable();
  return _ready;
}

async function seedProducts(db: Client): Promise<void> {
  const seed: Product[] = [
    { id: randomUUID(), name: "X-Burguer", price: 25.9, category: "lanche", active: true, createdAt: new Date().toISOString() },
    { id: randomUUID(), name: "X-Bacon", price: 29.9, category: "lanche", active: true, createdAt: new Date().toISOString() },
    { id: randomUUID(), name: "X-Calota", price: 59.9, category: "lanche", active: true, createdAt: new Date().toISOString() },
    { id: randomUUID(), name: "Coca-Cola 350ml", price: 7.0, category: "bebida", active: true, createdAt: new Date().toISOString() },
    { id: randomUUID(), name: "Batata Frita", price: 12.9, category: "acompanhamento", active: true, createdAt: new Date().toISOString() },
  ];
  for (const p of seed) {
    await db.execute({
      sql: "INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [p.id, p.name, p.price, p.category, null, 1, p.createdAt],
    });
  }
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    price: row.price as number,
    category: row.category as string,
    variations: row.variations ? JSON.parse(row.variations as string) : undefined,
    active: Boolean(row.active),
    createdAt: row.created_at as string,
  };
}

export async function getAllProducts(category?: string): Promise<Product[]> {
  await ready();
  const db = getDb();
  const { rows } = category
    ? await db.execute({ sql: "SELECT * FROM products WHERE lower(category) = lower(?)", args: [category] })
    : await db.execute("SELECT * FROM products");
  return rows.map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  await ready();
  const { rows } = await getDb().execute({ sql: "SELECT * FROM products WHERE id = ?", args: [id] });
  return rows[0] ? rowToProduct(rows[0]) : null;
}

export async function insertProduct(data: Omit<Product, "id" | "createdAt">): Promise<Product> {
  await ready();
  const product: Product = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
  await getDb().execute({
    sql: "INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [
      product.id,
      product.name,
      product.price,
      product.category,
      product.variations ? JSON.stringify(product.variations) : null,
      product.active ? 1 : 0,
      product.createdAt,
    ],
  });
  return product;
}

export async function updateProductById(id: string, fields: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
  await ready();
  const current = await getProductById(id);
  if (!current) return null;
  const updated = { ...current, ...fields };
  await getDb().execute({
    sql: "UPDATE products SET name=?, price=?, category=?, variations=?, active=? WHERE id=?",
    args: [
      updated.name,
      updated.price,
      updated.category,
      updated.variations ? JSON.stringify(updated.variations) : null,
      updated.active ? 1 : 0,
      id,
    ],
  });
  return updated;
}

export async function deleteProductById(id: string): Promise<boolean> {
  await ready();
  const { rowsAffected } = await getDb().execute({ sql: "DELETE FROM products WHERE id = ?", args: [id] });
  return rowsAffected > 0;
}
