import { db } from "@/actions/lib";
import { notFound } from "next/navigation";

/**
 * @param id string
 * @returns post-detail
 */
export default async function page({
  params: { id },
}: {
  params: { id: string };
}) {
  // ポスト詳細取得
  const post = await db.post.findUnique({
    where: {
      id,
    },
  });

  // 記事が見つからなかったら
  if (!post) {
    notFound();
  }

  return (
    <div>
      {post ? (
        <article>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </article>
      ) : (
        <p>記事はありません。</p>
      )}
    </div>
  );
}
