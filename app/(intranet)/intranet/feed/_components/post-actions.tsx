/** @format */

import { Heart, MessageCircle, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IntranetPost } from "../../_types/intranet";

interface PostActionsProps {
  post: IntranetPost;
}

export function PostActions({ post }: PostActionsProps) {
  const commentsCount = post.comments?.length ?? 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm">
          <Heart
            className={post.likedByMe ? "fill-current text-destructive" : ""}
          />
          {post.likes} curtidas
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle />
          {commentsCount} comentarios
        </Button>
      </div>

      <Button variant="ghost" size="sm">
        <Share2 />
        Compartilhar
      </Button>
    </div>
  );
}
