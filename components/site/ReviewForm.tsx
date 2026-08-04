"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import type { AgentReview } from "@/lib/agents";

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              star <= active
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-muted-foreground">
        {value === 0
          ? "Select a rating"
          : ["", "Poor", "Fair", "Good", "Very good", "Excellent"][value]}
      </span>
    </div>
  );
}

type Props = {
  agentId: string;
  existingReviewId?: string;
  onSuccess?: () => void;
};

export function ReviewForm({ agentId, onSuccess }: Props) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const submit = useMutation({
    mutationFn: () =>
      api.post<AgentReview>(`/agents/${agentId}/reviews`, { rating, text }),
    onSuccess: () => {
      toast.success("Review submitted! Thank you.");
      qc.invalidateQueries({ queryKey: ["agent-reviews", agentId] });
      setRating(0);
      setText("");
      onSuccess?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isValid = rating > 0 && text.trim().length >= 10;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) submit.mutate();
      }}
      className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4"
    >
      <h3 className="font-semibold text-foreground">Leave a review</h3>

      <div className="space-y-1">
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="space-y-1">
        <Textarea
          id="review-text"
          placeholder="Share your experience with this agent… (min. 10 characters)"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">
          {text.length}/1000
        </p>
      </div>

      <Button
        type="submit"
        disabled={!isValid || submit.isPending}
        className="rounded-full"
      >
        <Send className="mr-2 h-4 w-4" />
        {submit.isPending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
