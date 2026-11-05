import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { fail, handler, json } from "@/lib/api";
import { loginSchema } from "@/types";

// Credential check for API clients. Browser sessions: use next-auth `signIn("credentials")`.
export const POST = handler(async (req: Request) => {
  const { email, password } = loginSchema.parse(await req.json());
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) return fail("Invalid credentials", 401);
  return json({ id: user.id, name: user.name, email: user.email, role: user.role });
});
