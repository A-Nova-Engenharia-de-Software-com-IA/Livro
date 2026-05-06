import { createClient, type Client } from "@libsql/client";
import { randomUUID } from "crypto";

export const DB_URL = "file:/Users/rafaelscheidt/foka/projects/personal/flutter-aula/estudos/Livro/controlz-burguer/database/mastra.db";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferences?: string[];
  points: number;
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
    CREATE TABLE IF NOT EXISTS customers (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      phone       TEXT NOT NULL,
      email       TEXT,
      preferences TEXT,
      points      INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS customer_orders (
      customer_id TEXT NOT NULL,
      order_id    TEXT NOT NULL,
      PRIMARY KEY (customer_id, order_id)
    )
  `);
}

function ready(): Promise<void> {
  if (!_ready) _ready = ensureTable();
  return _ready;
}

function rowToCustomer(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    email: (row.email as string) || undefined,
    preferences: row.preferences ? JSON.parse(row.preferences as string) : [],
    points: row.points as number,
    createdAt: row.created_at as string,
  };
}

export async function insertCustomer(data: Omit<Customer, "id" | "createdAt" | "points">): Promise<Customer> {
  await ready();
  const customer: Customer = {
    id: randomUUID(),
    ...data,
    preferences: data.preferences ?? [],
    points: 0,
    createdAt: new Date().toISOString(),
  };
  await getDb().execute({
    sql: "INSERT INTO customers VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [customer.id, customer.name, customer.phone, customer.email ?? null, JSON.stringify(customer.preferences), customer.points, customer.createdAt],
  });
  return customer;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  await ready();
  const { rows } = await getDb().execute({ sql: "SELECT * FROM customers WHERE id = ?", args: [id] });
  return rows[0] ? rowToCustomer(rows[0]) : null;
}

export async function getAllCustomers(search?: string): Promise<Customer[]> {
  await ready();
  const db = getDb();
  const { rows } = search
    ? await db.execute({ sql: "SELECT * FROM customers WHERE lower(name) LIKE lower(?) OR phone LIKE ?", args: [`%${search}%`, `%${search}%`] })
    : await db.execute("SELECT * FROM customers");
  return rows.map(rowToCustomer);
}

export async function updateCustomerPreferences(id: string, preferences: string[]): Promise<Customer | null> {
  await ready();
  const { rowsAffected } = await getDb().execute({
    sql: "UPDATE customers SET preferences = ? WHERE id = ?",
    args: [JSON.stringify(preferences), id],
  });
  if (rowsAffected === 0) return null;
  return getCustomerById(id);
}

export async function getCustomerOrderIds(customerId: string): Promise<string[]> {
  await ready();
  const { rows } = await getDb().execute({ sql: "SELECT order_id FROM customer_orders WHERE customer_id = ?", args: [customerId] });
  return rows.map(r => r.order_id as string);
}
