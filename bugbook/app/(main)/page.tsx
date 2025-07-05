import { PostEditor } from "@/components/posts/post-editor";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function HomeRoute() {
  return (
    <main className="h-[200vh] w-full bg-red-50">
      <div className="w-full">
        <PostEditor />
      </div>
    </main>
  );
}
