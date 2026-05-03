export interface StockItem {
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  updatedAt: string;
}

// TODO: substituir por persistência real em produção
export const stock = new Map<string, StockItem>();

// Seed inicial para demo
const seed: StockItem[] = [
  { sku: "CARNE-180G", name: "Carne bovina 180g", quantity: 50, unit: "unidade", minThreshold: 10, updatedAt: new Date().toISOString() },
  { sku: "PAO-BRIOCHE", name: "Pão brioche", quantity: 60, unit: "unidade", minThreshold: 15, updatedAt: new Date().toISOString() },
  { sku: "QUEIJO-FATIADO", name: "Queijo fatiado", quantity: 8, unit: "pacote", minThreshold: 5, updatedAt: new Date().toISOString() },
  { sku: "BATATA-KG", name: "Batata palito", quantity: 12, unit: "kg", minThreshold: 5, updatedAt: new Date().toISOString() },
  { sku: "COCA-350", name: "Coca-Cola 350ml", quantity: 3, unit: "caixa", minThreshold: 2, updatedAt: new Date().toISOString() },
];
seed.forEach(s => stock.set(s.sku, s));
