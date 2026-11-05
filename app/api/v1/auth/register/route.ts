import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { fail, handler, json } from "@/lib/api";
import { registerSchema } from "@/types";

export const POST = handler(async (req: Request) => {
  const data = registerSchema.parse(await req.json());
  if (await db.user.findUnique({ where: { email: data.email } })) return fail("Email already registered", 409);
  const user = await db.user.create({
    data: { ...data, password: await bcrypt.hash(data.password, 12) },
    select: { id: true, name: true, email: true, role: true },
  });
  return json(user, 201);
});
