"use server";

import { authGuard } from "@/actions/auth";
import { clerkClient } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "./lib";

const UserSchema = z.object({
  name: z.string().max(240),
});

export const createUser = async (formData: FormData) => {
  // ユーザーIDを取得
  const id = authGuard();
  // フォームからユーザー名を取得
  const validatedData = UserSchema.parse({
    name: formData.get("name"),
  });
  const data: Prisma.UserUncheckedCreateInput = {
    ...validatedData,
    id,
  };

  // DBにユーザーを設定
  await db.user.create({
    data,
  });

  // Clerkのユーザーメタデータにオンボーディング完了ステータスを設定
  await clerkClient.users.updateUserMetadata(id, {
    publicMetadata: {
      onboarded: true,
    },
  });

  // キャッシュをクリア
  revalidatePath("/");

  // トップページにリダイレクト
  redirect("/");
};
