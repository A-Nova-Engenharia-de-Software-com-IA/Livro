import { createClient, type Client } from "@libsql/client";
import { randomUUID } from "crypto";

export const DB_URL = "file:/Users/rafaelscheidt/foka/projects/personal/flutter-aula/estudos/Livro/controlz-burguer/database/mastra.db";

export type OrderStatus =
  | "novo"
  | "em_preparo"
  | "pronto"
  | "em_entrega"
  | "entregue"
  | "cancelado";

export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  paymentMethod: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
}

let _db: Client | null = null;
let _ready: Promise<void> | null = null;

function getDb(): Client {
  if (!_db) _db = createClient({ url: DB_URL });
  return _db;
}

async function ensureTable(): Promise<void> {
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id             TEXT PRIMARY KEY,
      customer_id    TEXT NOT NULL,
      items          TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status         TEXT NOT NULL DEFAULT 'novo',
      total          REAL NOT NULL,
      created_at     TEXT NOT NULL,
      updated_at     TEXT NOT NULL
    )
  `);
}

function ready(): Promise<void> {
  if (!_ready) _ready = ensureTable();
  return _ready;
}

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    customerId: row.customer_id as string,
    items: JSON.parse(row.items as string) as OrderItem[],
    paymentMethod: row.payment_method as string,
    status: row.status as OrderStatus,
    total: row.total as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function insertOrder(data: Pick<Order, "customerId" | "items" | "paymentMethod">): Promise<Order> {
  await ready();
  const now = new Date().toISOString();
  const total = parseFloat(data.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0).toFixed(2));
  const order: Order = {
    id: randomUUID(),
    ...data,
    status: "novo",
    total,
    createdAt: now,
    updatedAt: now,
  };
  await getDb().execute({
    sql: "INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    args: [order.id, order.customerId, JSON.stringify(order.items), order.paymentMethod, order.status, order.total, order.createdAt, order.updatedAt],
  });
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  await ready();
  const { rows } = await getDb().execute({ sql: "SELECT * FROM orders WHERE id = ?", args: [id] });
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function getAllOrders(filters?: { status?: OrderStatus; customerId?: string }): Promise<Order[]> {
  await ready();
  const conditions: string[] = [];
  const args: (string)[] = [];

  if (filters?.status) { conditions.push("status = ?"); args.push(filters.status); }
  if (filters?.customerId) { conditions.push("customer_id = ?"); args.push(filters.customerId); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await getDb().execute({ sql: `SELECT * FROM orders ${where} ORDER BY created_at DESC`, args });
  return rows.map(rowToOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<{ previousStatus: OrderStatus | null; updated: boolean }> {
  await ready();
  const order = await getOrderById(id);
  if (!order) return { previousStatus: null, updated: false };
  await getDb().execute({
    sql: "UPDATE orders SET status = ?, updated_at = ? WHERE id = ?",
    args: [status, new Date().toISOString(), id],
  });
  return { previousStatus: order.status, updated: true };
}
