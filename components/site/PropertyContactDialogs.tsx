"use client";

import { useState } from "react";
import { Phone, Mail, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TIME_SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

function parseTimeSlot(slot: string): { hours: number; minutes: number } {
  const [time, period] = slot.split(" ");
  const [h, m] = time.split(":").map(Number);
  const hours = period === "PM" && h !== 12 ? h + 12 : period === "AM" && h === 12 ? 0 : h;
  return { hours, minutes: m };
}

type Props = {
  agentId: string;
  agentName: string;
  agentPhone: string;
  area?: string;
  trigger: React.ReactNode;
};

export function ContactAgentDialog({ agentId, agentName, agentPhone, area, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"choose" | "message" | "schedule">("choose");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const firstName = agentName.split(" ")[0];

  function reset() {
    setMode("choose");
    setDate(undefined);
    setSlot(undefined);
    setSubmitting(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setTimeout(reset, 200);
  }

  async function handleMessageSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      body: form.get("body") as string,
    };
    setSubmitting(true);
    try {
      await api.post(`/agents/${agentId}/message`, payload);
      handleOpenChange(false);
      toast.success(`Message sent to ${firstName}`, {
        description: "They typically reply within an hour.",
      });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleScheduleConfirm() {
    if (!date || !slot) {
      toast.error("Please pick a date and time");
      return;
    }
    const { hours, minutes } = parseTimeSlot(slot);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(hours, minutes, 0, 0);

    setSubmitting(true);
    try {
      await api.post(`/agents/${agentId}/message`, {
        name: "Meeting Request",
        email: "meeting@panpata.com",
        body: `Meeting requested for ${date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} at ${slot}`,
      });
      handleOpenChange(false);
      toast.success(`Meeting scheduled with ${firstName}`, {
        description: `${date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} at ${slot}`,
      });
    } catch {
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn(mode === "schedule" ? "sm:max-w-xl" : "sm:max-w-lg")}>
        {mode === "choose" && (
          <>
            <DialogHeader>
              <DialogTitle>Contact {firstName}</DialogTitle>
              <DialogDescription>Choose how you&apos;d like to get in touch.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Button asChild className="h-12 justify-start rounded-lg">
                <a href={`tel:${agentPhone.replace(/\s+/g, "")}`}>
                  <Phone className="mr-3 h-4 w-4" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-semibold">Call agent</span>
                    <span className="text-[11px] opacity-90">{agentPhone}</span>
                  </div>
                </a>
              </Button>
              <Button
                variant="outline"
                className="h-12 justify-start rounded-lg"
                onClick={() => setMode("message")}
              >
                <Mail className="mr-3 h-4 w-4" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-semibold">Send message</span>
                  <span className="text-[11px] text-muted-foreground">Replies within an hour</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-12 justify-start rounded-lg"
                onClick={() => setMode("schedule")}
              >
                <CalendarIcon className="mr-3 h-4 w-4" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-semibold">Schedule a meeting</span>
                  <span className="text-[11px] text-muted-foreground">Pick a date and time</span>
                </div>
              </Button>
            </div>
          </>
        )}

        {mode === "message" && (
          <>
            <DialogHeader>
              <DialogTitle>Message {firstName}</DialogTitle>
              <DialogDescription>
                Send a question or request — {firstName} typically replies within an hour.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMessageSubmit} className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="msg-name">Your name</Label>
                  <Input id="msg-name" name="name" required placeholder="Full name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="msg-phone">Phone</Label>
                  <Input id="msg-phone" name="phone" type="tel" placeholder="+880 1XXX-XXXXXX" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="msg-email">Email</Label>
                <Input id="msg-email" name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="msg-body">Message</Label>
                <Textarea
                  id="msg-body"
                  name="body"
                  required
                  rows={4}
                  defaultValue={`Hi ${firstName}, I'm interested in learning more about properties${area ? ` in ${area}` : ""}.`}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setMode("choose")}>
                  Back
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send message
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {mode === "schedule" && (
          <>
            <DialogHeader>
              <DialogTitle>Schedule a meeting with {firstName}</DialogTitle>
              <DialogDescription>
                Pick a date and time — you&apos;ll receive a confirmation by email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm">Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="pointer-events-auto rounded-md border p-3"
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm">Time</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm transition",
                        slot === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white hover:border-primary/50",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {date && slot && (
                  <p className="mt-4 rounded-md bg-primary/10 p-3 text-sm">
                    <span className="font-semibold">Selected:</span>{" "}
                    {date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} at {slot}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMode("choose")}>
                Back
              </Button>
              <Button onClick={handleScheduleConfirm} disabled={!date || !slot || submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm meeting
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

type TourProps = {
  propertyId: string;
  propertyAddress: string;
  trigger: React.ReactNode;
};

export function RequestTourDialog({ propertyId, propertyAddress, trigger }: TourProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | undefined>(undefined);
  const [tourType, setTourType] = useState<"in-person" | "video">("in-person");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setDate(undefined);
    setSlot(undefined);
    setTourType("in-person");
    setSubmitting(false);
  }
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setTimeout(reset, 200);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date || !slot) {
      toast.error("Please pick a date and time");
      return;
    }
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    if (!name || !email) return;

    const { hours, minutes } = parseTimeSlot(slot);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(hours, minutes, 0, 0);

    setSubmitting(true);
    try {
      await api.post("/tours", {
        propertyId,
        name,
        email,
        phone: (form.get("phone") as string) || undefined,
        tourType,
        scheduledAt: scheduledAt.toISOString(),
      });
      handleOpenChange(false);
      toast.success("Tour request submitted", {
        description: `${tourType === "in-person" ? "In-person tour" : "Video tour"} · ${date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} at ${slot}`,
      });
    } catch {
      toast.error("Failed to submit tour request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request a tour</DialogTitle>
          <DialogDescription>{propertyAddress}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="mb-2 block text-sm">Tour type</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["in-person", "video"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTourType(t)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm font-medium transition",
                    tourType === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-white hover:border-primary/50",
                  )}
                >
                  {t === "in-person" ? "In-person" : "Video chat"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block text-sm">Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                className="pointer-events-auto rounded-md border p-3"
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm">Time</Label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm transition",
                      slot === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white hover:border-primary/50",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tour-name">Your name</Label>
              <Input id="tour-name" name="name" required placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tour-phone">Phone</Label>
              <Input id="tour-phone" name="phone" type="tel" placeholder="+880 1XXX-XXXXXX" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tour-email">Email</Label>
            <Input id="tour-email" name="email" type="email" required placeholder="you@example.com" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!date || !slot || submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit tour request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
