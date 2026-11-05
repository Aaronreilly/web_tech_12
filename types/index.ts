import { z } from "zod";

// Single source of truth: used by API routes AND frontend forms
export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});
export const loginSchema = registerSchema.pick({ email: true, password: true });

export const productInput = z.object({
  title: z.string().min(3).max(80),
  tagline: z.string().min(5).max(140),
  description: z.string().min(20).max(5000),
  category: z.string().min(2),
  techStack: z.array(z.string().min(1)).min(1).max(20),
  tags: z.array(z.string().min(1)).max(10).default([]),
  pricing: z.enum(["FREE", "FREEMIUM", "PAID", "OPEN_SOURCE"]).default("FREE"),
  demoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  images: z.array(z.string().url()).max(8).default([]),
});
export const productPatch = productInput.partial().extend({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(), // admin only (enforced in route)
  featured: z.boolean().optional(),                                // admin only
});
export const listQuery = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  tech: z.string().optional(),
  pricing: z.string().optional(),
  sort: z.enum(["top", "new", "trending"]).default("top"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});
export const commentInput = z.object({
  body: z.string().min(1).max(2000),
  parentId: z.string().optional(),
});

export type ProductInput = z.infer<typeof productInput>;
export type ListQuery = z.infer<typeof listQuery>;
export type ProductDTO = ProductInput & {
  id: string; slug: string; upvoteCount: number; views: number; featured: boolean; createdAt: string;
};
export type Paginated<T> = { items: T[]; total: number; page: number; limit: number };
