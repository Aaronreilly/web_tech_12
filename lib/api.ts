import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError, ZodSchema } from "zod";
import { authOptions } from "./auth";

export type SessionUser = { id: string; role: "USER" | "ADMIN" };

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const fail = (error: string, status = 400) => json({ error }, status);

export async function currentUser(): Promise<SessionUser | null> {
  const s = await getServerSession(authOptions);
  return s?.user ? (s.user as unknown as SessionUser) : null;
}

export async function parse<T>(schema: ZodSchema<T>, data: unknown): Promise<T> {
  return schema.parse(data);
}

// Wrap handlers: uniform error handling for Zod + unexpected errors
export function handler<A extends unknown[]>(fn: (...a: A) => Promise<Response>) {
  return async (...a: A) => {
    try { return await fn(...a); }
    catch (e) {
      if (e instanceof ZodError) return json({ error: "Validation failed", issues: e.flatten() }, 422);
      console.error(e);
      return fail("Internal server error", 500);
    }
  };
}

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);
