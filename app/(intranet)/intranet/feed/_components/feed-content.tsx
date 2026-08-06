/** @format */

import { PageHeader } from "../../_components/shared/page-header";
import { mockPosts } from "../../_mock";
import { PostComposer } from "./post-composer";
import { PostList } from "./post-list";

export function FeedContent() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Feed"
        description="Atualizacoes, comunicados e interacoes da intranet."
      />

      <div className="space-y-4">
        <PostComposer />
        <PostList posts={mockPosts} />
      </div>
    </section>
  );
}
