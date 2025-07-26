import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH() {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorised" }, { status: 401 });

    await db.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
