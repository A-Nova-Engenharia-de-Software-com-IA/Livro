import { randomUUID } from "crypto";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  variations?: string[];
  active: boolean;
  createdAt: string;
}

// TODO: substituir por persistência real (LibSQL/Postgres) em produção
export const products = new Map<string, Product>();

// Seed inicial para demo
const seed: Product[] = [
  { id: randomUUID(), name: "X-Burguer", price: 25.9, category: "lanche", active: true, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: "X-Bacon", price: 29.9, category: "lanche", active: true, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: "X-Calota", price: 59.9, category: "lanche", active: true, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: "Coca-Cola 350ml", price: 7.0, category: "bebida", active: true, createdAt: new Date().toISOString() },
  { id: randomUUID(), name: "Batata Frita", price: 12.9, category: "acompanhamento", active: true, createdAt: new Date().toISOString() },
];
seed.forEach(p => products.set(p.id, p));
