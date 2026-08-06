/** @format */

import { IntranetPostComment } from "../../_types/intranet";
import { EmployeeAvatar } from "../../_components/shared/employee-avatar";

interface CommentListProps {
  comments?: readonly IntranetPostComment[];
}

export function CommentList({ comments = [] }: CommentListProps) {
  if (comments.length === 0) return null;

  return (
    <div className="space-y-3 border-t pt-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <EmployeeAvatar
            name={comment.author}
            fallbackColor={comment.avatarColor}
            className="size-8"
          />
          <div className="min-w-0 rounded-lg bg-muted px-3 py-2">
            <p className="text-sm font-medium">{comment.author}</p>
            <p className="text-sm text-muted-foreground">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
