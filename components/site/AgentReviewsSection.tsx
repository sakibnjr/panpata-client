"use client";

import { Star, MessageSquarePlus, Trash2 } from "lucide-react";
import { ReviewForm } from "@/components/site/ReviewForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAgentReviews, type ReviewsResponse } from "@/lib/agents";
import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-role";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { getOptimizedImageUrl } from "@/lib/utils";

type Props = {
  agentId: string;
  initialReviewsData: ReviewsResponse;
};

export function AgentReviewsSection({ agentId, initialReviewsData }: Props) {
  const { user } = useAuth();
  const { isAdmin } = useRoles();
  const qc = useQueryClient();
  const isAuthed = !!user;

  const { data: reviewsData = initialReviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["agent-reviews", agentId],
    queryFn: () => fetchAgentReviews(agentId),
    initialData: initialReviewsData,
    enabled: !!agentId,
  });

  const deleteReview = useMutation({
    mutationFn: (reviewId: string) =>
      api.delete(`/agents/${agentId}/reviews/${reviewId}`),
    onSuccess: () => {
      toast.success("Review deleted");
      qc.invalidateQueries({ queryKey: ["agent-reviews", agentId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reviews = reviewsData.reviews ?? [];
  const avgRating = reviewsData.meta.avgRating ?? null;
  const reviewCount = reviewsData.meta.count ?? 0;
  const myReview = user ? reviews.find((r) => r.reviewer.id === user.id) : null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Reviews</h2>
        {avgRating !== null && (
          <div className="flex items-center gap-1.5 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-bold">{avgRating.toFixed(1)}</span>
            <span className="text-muted-foreground">· {reviewCount} review{reviewCount !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {isAuthed && !myReview && (
        <div className="mb-5">
          <ReviewForm agentId={agentId} />
        </div>
      )}

      {isAuthed && myReview && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/20 px-4 py-2.5 text-sm text-primary">
          <MessageSquarePlus className="h-4 w-4" />
          You&apos;ve already reviewed this agent.
        </div>
      )}

      {reviewsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-12 text-center">
          <Star className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {r.reviewer.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getOptimizedImageUrl(r.reviewer.avatarUrl)}
                      alt={r.reviewer.displayName ?? ""}
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {(r.reviewer.displayName ?? "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{r.reviewer.displayName ?? "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  {(isAdmin || (user && r.reviewer.id === user.id)) && (
                    <button
                      onClick={() => {
                        if (confirm("Delete this review?")) deleteReview.mutate(r.id);
                      }}
                      className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
