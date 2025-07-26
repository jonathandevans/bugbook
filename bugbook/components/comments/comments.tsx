import { CommentData, CommentsPage, PostData } from "@/lib/types";
import { CommentInput } from "./comment-input";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstace from "@/lib/ky";
import { UserTooltop } from "../user-tooltip";
import Link from "next/link";
import { UserAvatar } from "../ui/user-avatar";
import { formatRelativeDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "../providers/session-provider";
import { CommentMoreButton } from "./comment-more-button";

interface CommentsProps {
  post: PostData;
}

export function Comments({ post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstace
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-muted-foreground text-center">No comments yet</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

interface CommentProps {
  comment: CommentData;
}

function Comment({ comment }: CommentProps) {
  const { user } = useSession();

  return (
    <div className="flex gap-3 py-3 group/comment">
      <span className="hidden sm:inline">
        <UserTooltop user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserTooltop>
      </span>
      <div>
        <div className="flex items-center gap-2 text-sm">
          <UserTooltop user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltop>
          <span className="text-muted-foreground text-xs">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>

        <div>{comment.content}</div>
      </div>
      {comment.user.id === user.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
