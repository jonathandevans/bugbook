"use server";

import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPostAction(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorised");

  const { content, mediaIds } = createPostSchema.parse(input);

  const newPost = await db.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}

export async function deletePostAction(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorised");

  const post = await db.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post not found");

  if (post.userId !== user.id) throw new Error("Unauthorised");

  const deletedPost = await db.post.delete({
    where: { id },
    include: getPostDataInclude(user.id),
  });

  return deletedPost;
}
