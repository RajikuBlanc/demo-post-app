import { db } from "@/actions/lib";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  const posts = await db.post.findMany();
  return (
    <div className="w-full flex items-center justify-center">
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="">
          <p>ポストがありません。</p>
          <Button>新規作成</Button>
        </div>
      )}
    </div>
  );
}
