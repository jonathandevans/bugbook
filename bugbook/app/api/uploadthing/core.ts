import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorised");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: file.ufsUrl,
        },
      });

      return { avatarUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
