import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { currentUser, fail, handler, json, slugify } from "@/lib/api";
import { listQuery, productInput } from "@/types";

export const GET = handler(async (req: Request) => {
  const q = listQuery.parse(Object.fromEntries(new URL(req.url).searchParams));
  const where: Prisma.ProductWhereInput = {
    status: "APPROVED",
    ...(q.category && { category: q.category }),
    ...(q.tag && { tags: { has: q.tag } }),
    ...(q.tech && { techStack: { has: q.tech } }),
    ...(q.pricing && { pricing: q.pricing }),
    ...(q.search && {
      OR: [
        { title: { contains: q.search, mode: "insensitive" } },
        { tagline: { contains: q.search, mode: "insensitive" } },
      ],
    }),
  };
  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    q.sort === "new" ? [{ createdAt: "desc" }]
    : q.sort === "trending" ? [{ views: "desc" }, { upvoteCount: "desc" }]
    : [{ upvoteCount: "desc" }];
  const [items, total] = await Promise.all([
    db.product.findMany({ where, orderBy, skip: (q.page - 1) * q.limit, take: q.limit }),
    db.product.count({ where }),
  ]);
  return json({ items, total, page: q.page, limit: q.limit });
});

export const POST = handler(async (req: Request) => {
  const user = await currentUser();
  if (!user) return fail("Unauthorized", 401);
  const data = productInput.parse(await req.json());
  const product = await db.product.create({
    data: { ...data, slug: slugify(data.title), authorId: user.id },
  });
  return json(product, 201);
});
