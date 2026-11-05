import { db } from "@/lib/db";
import { currentUser, fail, handler, json } from "@/lib/api";
import { commentInput } from "@/types";

export const POST = handler(async (req: Request, { params }: { params: { idOrSlug: string } }) => {
  const user = await currentUser();
  if (!user) return fail("Unauthorized", 401);
  const data = commentInput.parse(await req.json());
  if (data.parentId) {
    const parent = await db.comment.findUnique({ where: { id: data.parentId } });
    if (!parent || parent.productId !== params.idOrSlug) return fail("Invalid parent comment", 400);
  }
  const comment = await db.comment.create({
    data: { ...data, productId: params.idOrSlug, authorId: user.id },
  });
  return json(comment, 201);
});
