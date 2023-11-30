import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // 公開ルートの設定(ログインせずとも見れるページ)
  publicRoutes: ["/", "/terms"],
  async afterAuth(auth, req) {
    if (!auth.userId && auth.isPublicRoute) {
      return;
    }
    // // 未ログインかつ公開ルートへのアクセスではない場合、ログイン画面にリダイレクト
    // if (!auth.user && !auth.isPublicRoute) {
    //   return redirectToSignIn({ returnBackUrl: req.url });
    // }

    // セッションにオンボーディングの完了ステータスがあるかどうか
    let onboarded = auth.sessionClaims?.onboarded;

    // オンボーディング前ならオンボーディングページに遷移
    if (!onboarded && req.nextUrl.pathname !== "/onboarding") {
      const orgSelection = new URL("onboarding", req.url);
      return NextResponse.redirect(orgSelection.href);
    }

    // オンボーディング済みでオンボーディングページにアクセスしたらトップページにリダイレクト
    if (onboarded && req.nextUrl.pathname === "/onboarding") {
      const orgSelection = new URL("/", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
