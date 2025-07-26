"use server";

import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitCommentAction({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorised");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const [newComment] = await db.$transaction([
    db.comment.create({
      data: {
        content: contentValidated,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.user.id !== user.id
      ? [
          db.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              postId: post.id,
              type: "comment",
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

export async function deleteCommentAction(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorised");

  const comment = await db.comment.findUnique({
    where: { id },
  });
  if (!comment) throw new Error("Comment not found");
  if (comment.userId !== user.id) throw new Error("Unauthorised");

  const deletedComment = await db.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
