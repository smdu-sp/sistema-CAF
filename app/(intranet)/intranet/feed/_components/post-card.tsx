/** @format */

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { EmployeeAvatar } from "../../_components/shared/employee-avatar";
import { IntranetPost } from "../../_types/intranet";
import { publicationTypeMeta } from "../../_mock";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { PostActions } from "./post-actions";

interface PostCardProps {
  post: IntranetPost;
}

export function PostCard({ post }: PostCardProps) {
  const meta = publicationTypeMeta[post.type];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <EmployeeAvatar name={post.author} className="size-11" />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold">{post.author}</h2>
              {meta && <Badge variant="secondary">{meta.label}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              {post.cargo} - {post.time}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="whitespace-pre-line text-sm leading-relaxed">
          {post.text}
        </p>

        {post.image && (
          <div className="relative aspect-[16/7] overflow-hidden rounded-lg border bg-muted">
            <Image
              src={post.image}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 640px, 100vw"
            />
          </div>
        )}

        <PostActions post={post} />
        <CommentList comments={post.comments} />
        <CommentForm />
      </CardContent>
    </Card>
  );
}
