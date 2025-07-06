import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { postDataInclude } from "@/lib/types";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorised" }, { status: 401 });

    const posts = await db.post.findMany({
      include: postDataInclude,
      orderBy: { createdAt: "desc" },
    });

    return Response.json(posts);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
