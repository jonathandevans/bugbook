"use server";

import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { createPostSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function submitPostAction(input: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorised");

  const { content } = createPostSchema.parse({ content: input });

  await db.post.create({
    data: {
      content,
      userId: user.id,
    },
  });

  revalidatePath("")
}
