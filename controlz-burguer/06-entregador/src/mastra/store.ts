export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  available: boolean;
  createdAt: string;
}

export type DeliveryStatus = "aguardando" | "em_rota" | "entregue";

export interface Delivery {
  orderId: string;
  driverId: string;
  address: string;
  status: DeliveryStatus;
  estimatedMinutes: number;
  assignedAt: string;
}

// TODO: substituir por persistência real em produção
export const drivers = new Map<string, Driver>();
export const deliveries = new Map<string, Delivery>();

// Seed com um motoboy disponível
import { randomUUID } from "crypto";
const driverId = randomUUID();
drivers.set(driverId, {
  id: driverId,
  name: "Carlos Motoboy",
  phone: "11999990001",
  vehicle: "Honda CB 150",
  available: true,
  createdAt: new Date().toISOString(),
});
