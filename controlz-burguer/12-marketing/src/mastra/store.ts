export type ContentType =
  | "instagram_post"
  | "promo_copy"
  | "product_description"
  | "weekly_campaign";

export interface GeneratedContent {
  id: string;
  type: ContentType;
  prompt: string;
  content: string;
  createdAt: string;
}

// TODO: substituir por persistência real em produção
export const generatedContents: GeneratedContent[] = [];
