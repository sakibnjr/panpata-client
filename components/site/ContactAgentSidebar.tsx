"use client";

import { useState } from "react";
import { Phone, Mail, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Agent } from "@/lib/mock";

function agentPhone(id: string) {
  const tail = id.replace(/\D/g, "").padStart(4, "0").slice(-4);
  return `+8801700${tail.padStart(6, "0").slice(-6)}`;
}

const TIME_SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

export function ContactAgentSidebar({ a }: { a: Agent }) {
  const [messageOpen, setMessageOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | undefined>(undefined);

  const phone = agentPhone(a.id);
  const firstName = a.name.split(" ")[0];

  function handleMessageSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    if (!name) return;
    setMessageOpen(false);
    toast.success(`Message sent to ${firstName}`, {
      description: "They typically reply within an hour.",
    });
    e.currentTarget.reset();
  }

  function handleScheduleConfirm() {
    if (!date || !slot) {
      toast.error("Please pick a date and time");
      return;
    }
    setScheduleOpen(false);
    toast.success(`Meeting scheduled with ${firstName}`, {
      description: `${date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} at ${slot}`,
    });
    setDate(undefined);
    setSlot(undefined);
  }

  return (
    <>
      <div className="mt-5 space-y-2">
        <Button asChild className="w-full rounded-full">
          <a href={`tel:${phone.replace(/\s+/g, "")}`}>
            <Phone className="mr-2 h-4 w-4" /> Call agent
          </a>
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={() => setMessageOpen(true)}
        >
          <Mail className="mr-2 h-4 w-4" /> Send message
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={() => setScheduleOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" /> Schedule a meeting
        </Button>
      </div>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="sm:max-w-lg">
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
                defaultValue={`Hi ${firstName}, I'm interested in learning more about properties in ${a.area}.`}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setMessageOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Schedule a meeting with {firstName}</DialogTitle>
            <DialogDescription>
              Pick a date and time — you'll receive a confirmation by email.
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
                className="rounded-md border"
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
                    className={`rounded-md border px-3 py-2 text-sm transition ${slot === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white hover:border-primary/50"
                      }`}
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
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleConfirm} disabled={!date || !slot}>
              Confirm meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
