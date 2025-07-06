import { ForYouFeed } from "@/components/for-you-feed";
import Post from "@/components/posts/post";
import { PostEditor } from "@/components/posts/post-editor";
import { TrendsSidebar } from "@/components/trends-sidebar";
import { db } from "@/lib/db";
import { postDataInclude } from "@/lib/types";

export default async function HomeRoute() {
  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
