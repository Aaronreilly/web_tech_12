import { db } from "@/lib/db";
import { currentUser, fail, handler, json } from "@/lib/api";
import { productPatch } from "@/types";

type Ctx = { params: { idOrSlug: string } };

// GET treats the param as a slug; PATCH/DELETE treat it as an id
export const GET = handler(async (_: Request, { params }: Ctx) => {
  const product = await db.product.findUnique({
    where: { slug: params.idOrSlug },
    include: {
      author: { select: { name: true } },
      comments: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!product || product.status !== "APPROVED") return fail("Not found", 404);
  await db.product.update({ where: { id: product.id }, data: { views: { increment: 1 } } });
  return json(product);
});

async function authorize(id: string) {
  const user = await currentUser();
  if (!user) return { error: fail("Unauthorized", 401) };
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return { error: fail("Not found", 404) };
  if (product.authorId !== user.id && user.role !== "ADMIN") return { error: fail("Forbidden", 403) };
  return { user, product };
}

export const PATCH = handler(async (req: Request, { params }: Ctx) => {
  const auth = await authorize(params.idOrSlug);
  if (auth.error) return auth.error;
  const data = productPatch.parse(await req.json());
  if (auth.user!.role !== "ADMIN") { delete data.status; delete data.featured; }
  return json(await db.product.update({ where: { id: params.idOrSlug }, data }));
});

export const DELETE = handler(async (_: Request, { params }: Ctx) => {
  const auth = await authorize(params.idOrSlug);
  if (auth.error) return auth.error;
  await db.product.delete({ where: { id: params.idOrSlug } });
  return json({ message: "Deleted" });
});
