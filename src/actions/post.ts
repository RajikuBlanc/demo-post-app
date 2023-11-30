"use server";

import { randomUUID } from "crypto";
import { authGuard } from "./auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db, deleteImage, putImage } from "./lib";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PostSchema = z.object({
  body: z
    .string()
    .min(1, {
      message: "本文を入力してください",
    })
    .max(140, {
      message: "本文は140文字以内で入力してください",
    }),
  title: z
    .string()
    .min(1, {
      message: "タイトルを入力してください",
    })
    .max(140, {
      message: "タイトルは140文字以内で入力してください",
    }),
});

export type FormState =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      fieldErrors: {
        body?: string[] | undefined;
      };
    }
  | {
      status: "idle";
    };

/**
 * ポスト作成
 *
 * @param formData
 */
export const createPost = async (formData: FormData): Promise<FormState> => {
  // 投稿者ID
  const authorId = authGuard();
  // ポストID
  const id = randomUUID();
  // フォーム情報
  const validatedData = PostSchema.parse({
    body: formData.get("body"),
    title: formData.get("title"),
  });
  const newData: Prisma.PostUncheckedCreateInput = {
    ...validatedData,
    id,
    authorId,
  };
  const thumbnailDataURL = formData.get("thumbnail") as string;
  if (thumbnailDataURL) {
    newData.thumbnailURL = await putImage(
      thumbnailDataURL,
      `posts/${id}/thumbnail.png`
    );
  }
  await db.post.create({
    data: newData,
  });
  revalidatePath("/");
  redirect("/");
};

/**
 * ポスト更新
 *
 * @param id
 * @param formData
 */
export const updatePost = async (
  id: string,
  formData: FormData
): Promise<FormState> => {
  // 投稿者ID
  const authorId = authGuard();
  // フォーム情報
  const validatedData = PostSchema.safeParse({
    body: formData.get("body"),
  });

  if (!validatedData.success) {
    return {
      status: "error",
      fieldErrors: validatedData.error.flatten().fieldErrors,
    };
  }

  // チェック後情報
  const newData: Prisma.PostUncheckedCreateInput = {
    ...validatedData.data,
    id,
    authorId,
  };
  // サムネイル情報
  const thumbnailDataURL = formData.get("thumbnail") as string;
  const thumbnailAction = formData.get("thumbnail-action") as string;
  const imagePath = `posts/${id}/thumbnail.png`;

  // サムネイルURLが設定されていて、アクションがsaveの場合
  if (thumbnailDataURL && thumbnailAction === "save") {
    newData.thumbnailURL = await putImage(thumbnailDataURL, imagePath);
    // アクションがdeleteの場合
  } else if (thumbnailAction === "delete") {
    newData.thumbnailURL = null;
    await deleteImage(imagePath);
  }

  // DB更新
  await db.post.update({
    where: {
      id,
      authorId,
    },
    data: newData,
  });

  revalidatePath("/");
  return {
    status: "success",
    message: "更新しました",
  };
};

/**
 * ポスト削除
 *
 * @param id
 * @param imageURL
 */
export const deletePost = async (id: string, imageURL?: string | null) => {
  // 投稿者ID取得
  const authorId = authGuard();
  // ポストを削除
  await db.post.delete({
    where: {
      id,
      authorId,
    },
  });
  // サムネイル画像を削除
  if (imageURL) {
    deleteImage(imageURL.replace(process.env.IMAGE_HOST_URL as string, ""));
  }
  revalidatePath("/");
  redirect("/");
};

export const getOwnPost = (id: string) => {
  const authorId = authGuard();
  return db.post.findUnique({
    where: {
      id,
      authorId,
    },
  });
};
