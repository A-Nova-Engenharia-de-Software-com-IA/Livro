export type Channel = "whatsapp" | "email";

export interface Notification {
  id: string;
  to: string;
  channel: Channel;
  subject?: string;
  message: string;
  sentAt: string;
}

export const notifications: Notification[] = [];

// Templates pré-definidos para eventos do negócio
export const templates: Record<string, { subject?: string; body: string }> = {
  pedido_recebido: {
    subject: "Pedido recebido!",
    body: "Olá {nome}! Seu pedido #{orderId} foi recebido e já está sendo preparado. Tempo estimado: {tempo} minutos.",
  },
  pedido_pronto: {
    subject: "Seu pedido está pronto!",
    body: "Olá {nome}! Seu pedido #{orderId} está pronto e saindo para entrega agora.",
  },
  entregue: {
    subject: "Pedido entregue!",
    body: "Olá {nome}! Seu pedido #{orderId} foi entregue. Bom apetite! Avalie sua experiência: {link}",
  },
  cancelado: {
    subject: "Pedido cancelado",
    body: "Olá {nome}! Infelizmente seu pedido #{orderId} foi cancelado. Entre em contato para mais informações.",
  },
  promocao: {
    subject: "Promoção especial para você!",
    body: "Olá {nome}! Você tem um cupom exclusivo: {codigo} - {desconto}% de desconto. Válido até {validade}.",
  },
};
