import { db } from "@/lib/db";
import { currentUser, fail, handler, json } from "@/lib/api";

export const POST = handler(async (_: Request, { params }: { params: { idOrSlug: string } }) => {
  const user = await currentUser();
  if (!user) return fail("Unauthorized", 401);
  const where = { userId_productId: { userId: user.id, productId: params.idOrSlug } };
  const existing = await db.upvote.findUnique({ where });
  const [, product] = await db.$transaction([
    existing
      ? db.upvote.delete({ where })
      : db.upvote.create({ data: { userId: user.id, productId: params.idOrSlug } }),
    db.product.update({
      where: { id: params.idOrSlug },
      data: { upvoteCount: { increment: existing ? -1 : 1 } },
      select: { upvoteCount: true },
    }),
  ]);
  return json({ upvoted: !existing, upvoteCount: product.upvoteCount });
});
