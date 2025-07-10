"use client";

import { useFollowerInfo } from "@/hooks/use-follower-info";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import kyInstace from "@/lib/ky";
import { toast } from "sonner";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export function FollowButton({ userId, initialState }: FollowButtonProps) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];
  const { data } = useFollowerInfo(userId, initialState);

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstace.delete(`/api/users/${userId}/followers`)
        : kyInstace.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const prevState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (prevState?.followers || 0) + (prevState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !prevState?.isFollowedByUser,
      }));

      return { prevState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.prevState);

      console.error(error);
      toast.error("Error", {
        description: "Something went wrong, please try again",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
