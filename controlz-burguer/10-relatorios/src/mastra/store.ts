import { randomUUID } from "crypto";

export interface FakeOrder {
  id: string;
  product: string;
  category: string;
  qty: number;
  unitPrice: number;
  total: number;
  hour: number; // 0-23
  dayOffset: number; // dias atrás
}

const PRODUCTS = [
  { name: "X-Burguer", category: "lanche", price: 25.9 },
  { name: "X-Bacon", category: "lanche", price: 29.9 },
  { name: "X-Salada", category: "lanche", price: 22.9 },
  { name: "Coca-Cola", category: "bebida", price: 7.0 },
  { name: "Suco Laranja", category: "bebida", price: 9.0 },
  { name: "Batata Frita", category: "acompanhamento", price: 12.9 },
  { name: "Onion Rings", category: "acompanhamento", price: 14.9 },
];
const PEAK_HOURS = [12, 13, 19, 20, 21];

// Gera 50 pedidos fake para os últimos 30 dias
export const fakeOrders: FakeOrder[] = Array.from({ length: 50 }, () => {
  const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const qty = Math.floor(Math.random() * 3) + 1;
  const usePeak = Math.random() > 0.4;
  const hour = usePeak
    ? PEAK_HOURS[Math.floor(Math.random() * PEAK_HOURS.length)]
    : Math.floor(Math.random() * 14) + 8;
  return {
    id: randomUUID(),
    product: p.name,
    category: p.category,
    qty,
    unitPrice: p.price,
    total: parseFloat((p.price * qty).toFixed(2)),
    hour,
    dayOffset: Math.floor(Math.random() * 30),
  };
});
