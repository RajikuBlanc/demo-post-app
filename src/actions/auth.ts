"use server";

import { auth } from "@clerk/nextjs";

export const authGuard = () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("新規登録を行なってユーザーを作成してください。");
  }
  return userId;
};
