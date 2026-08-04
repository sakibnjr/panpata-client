"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-role";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DbProperty } from "@/lib/properties";
import { ImagePlus, Loader2, Lock, Plus, X, User, Star } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/utils";

type PropertyType = "apartment" | "house" | "land" | "commercial" | "offices" | "residential" | "building";
type PropertyStatus = "active" | "pending" | "open_house" | "sold";

type FormState = {
  address: string;
  area: string;
  zip: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  type: PropertyType;
  status: PropertyStatus;
  description: string;
  tag: string;
  agentId: string;
  ownerName: string;
  ownerAddress: string;
  ownerPhone: string;
  ownerProfession: string;
  ownerEmail: string;
};

type AgentOption = {
  id: string;
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
};

const MAX_IMAGES = 5;

const empty: FormState = {
  address: "",
  area: "",
  zip: "",
  price: "",
  beds: "0",
  baths: "0",
  sqft: "0",
  type: "house",
  status: "active",
  description: "",
  tag: "",
  agentId: "",
  ownerName: "",
  ownerAddress: "",
  ownerPhone: "",
  ownerProfession: "",
  ownerEmail: "",
};

function fromRow(row: DbProperty): FormState {
  return {
    address: row.address,
    area: row.area,
    zip: row.zip,
    price: String(row.price),
    beds: String(row.beds),
    baths: String(row.baths),
    sqft: String(row.sqft),
    type: row.type,
    status: row.status,
    description: row.description ?? "",
    tag: row.tag ?? "",
    agentId: row.agentId ?? "",
    ownerName: row.ownerName ?? "",
    ownerAddress: row.ownerAddress ?? "",
    ownerPhone: row.ownerPhone ?? "",
    ownerProfession: row.ownerProfession ?? "",
    ownerEmail: row.ownerEmail ?? "",
  };
}

export function PropertyFormDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: DbProperty | null;
}) {
  const { user } = useAuth();
  const { isAdmin } = useRoles();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(empty);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!initial;

  const { data: agents = [] } = useQuery<AgentOption[]>({
    queryKey: ["admin-agents"],
    queryFn: () => api.get<AgentOption[]>("/admin/agents"),
    enabled: isAdmin && open,
  });

  useEffect(() => {
    if (open) {
      const f = initial ? fromRow(initial) : empty;
      setForm(f);
      setFeatures(initial?.features ?? []);
      if (initial) {
        const existingImages = (initial as DbProperty & { images?: string[] }).images ?? [];
        const combined = existingImages.length > 0
          ? existingImages
          : initial.image ? [initial.image] : [];
        setImages(combined);
      } else {
        setImages([]);
      }
      setUploading([]);
      setFeatureInput("");
    }
  }, [open, initial]);

  const uploadImage = useCallback(async (file: File) => {
    if (images.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }
    const slotIndex = images.length;
    setUploading((prev) => {
      const next = [...prev];
      next[slotIndex] = true;
      return next;
    });
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.upload<{ url: string }>("/upload/property-image", fd);
      setImages((prev) => {
        if (prev.length >= MAX_IMAGES) return prev;
        return [...prev, res.url];
      });
      toast.success("Image uploaded ✓");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading((prev) => {
        const next = [...prev];
        next[slotIndex] = false;
        return next;
      });
    }
  }, [images]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_IMAGES - images.length;
    files.slice(0, remaining).forEach((f) => uploadImage(f));
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    const remaining = MAX_IMAGES - images.length;
    files.slice(0, remaining).forEach((f) => uploadImage(f));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setCover = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [picked] = next.splice(index, 1);
      return [picked, ...next];
    });
  };

  const isUploadingAny = uploading.some(Boolean);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      if (images.length === 0) throw new Error("Please upload at least one property image.");

      const payload: Record<string, unknown> = {
        address: form.address,
        area: form.area,
        zip: form.zip,
        price: Number(form.price),
        beds: Number(form.beds),
        baths: Number(form.baths),
        sqft: Number(form.sqft),
        type: form.type,
        status: form.status,
        image: images[0],
        images,
        description: form.description || null,
        tag: form.tag || null,
      };

      if (isAdmin && form.agentId) {
        payload.agentId = form.agentId;
      }

      payload.features = features;

      if (form.ownerName)       payload.ownerName       = form.ownerName;
      if (form.ownerAddress)    payload.ownerAddress    = form.ownerAddress;
      if (form.ownerPhone)      payload.ownerPhone      = form.ownerPhone;
      if (form.ownerProfession) payload.ownerProfession = form.ownerProfession;
      if (form.ownerEmail)      payload.ownerEmail      = form.ownerEmail;

      if (isEdit && initial) {
        await api.patch(`/properties/${initial.id}`, payload);
      } else {
        await api.post("/properties", payload);
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? "Listing updated ✓" : "Listing created ✓");
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings-meta"] });
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit listing" : "New listing"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the property details below."
              : "Fill in the details to create a new property listing."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-5"
        >
          {isAdmin && !isEdit && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <Label className="text-sm font-semibold text-primary">Assign to agent</Label>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Select an agent to assign this listing to, or leave blank to assign it to yourself.
              </p>
              <Select
                value={form.agentId}
                onValueChange={(v) => set("agentId", v === "__self__" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__self__">
                    <span className="text-muted-foreground">Assign to myself</span>
                  </SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {(a.displayName ?? a.email)[0].toUpperCase()}
                        </div>
                        <span>{a.displayName ?? a.email}</span>
                        <span className="text-xs text-muted-foreground">{a.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>
                Property images <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {images.length}/{MAX_IMAGES} · First image is the cover
              </span>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={onFileChange}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {images.map((url, idx) => (
                  <div
                    key={url + idx}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-colors ${
                      idx === 0 ? "border-primary" : "border-border hover:border-primary/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getOptimizedImageUrl(url)}
                      alt={`Image ${idx + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                        Cover
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx !== 0 && (
                        <button
                          type="button"
                          title="Set as cover"
                          onClick={() => setCover(idx)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-primary transition-colors"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => removeImage(idx)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-destructive transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {uploading.filter(Boolean).map((_, i) => (
                  <div
                    key={`uploading-${i}`}
                    className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-primary/5"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ))}
              </div>
            )}

            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                disabled={isUploadingAny}
                className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingAny ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-xs">Uploading…</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6" />
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {images.length === 0 ? "Click to upload images" : "Add more images"}
                      </p>
                      <p className="text-xs">
                        Up to {MAX_IMAGES - images.length} more · JPEG, PNG, WebP
                      </p>
                    </div>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              required
              placeholder="House 12, Road 4, Dhanmondi, Dhaka 1209"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="area">Area / City</Label>
              <Input
                id="area"
                required
                placeholder="Dhanmondi"
                value={form.area}
                onChange={(e) => set("area", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zip">ZIP / Post code</Label>
              <Input
                id="zip"
                required
                placeholder="1209"
                value={form.zip}
                onChange={(e) => set("zip", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (BDT)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                required
                placeholder="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="beds">Beds</Label>
              <Input
                id="beds"
                type="number"
                min="0"
                value={form.beds}
                onChange={(e) => set("beds", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="baths">Baths</Label>
              <Input
                id="baths"
                type="number"
                min="0"
                value={form.baths}
                onChange={(e) => set("baths", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sqft">Sqft</Label>
              <Input
                id="sqft"
                type="number"
                min="0"
                value={form.sqft}
                onChange={(e) => set("sqft", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v as PropertyType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="offices">Offices</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="building">Building</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as PropertyStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="open_house">Open House</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tag">Badge tag (optional)</Label>
            <Input
              id="tag"
              placeholder="New, Hot, Reduced…"
              value={form.tag}
              onChange={(e) => set("tag", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Property features / amenities</Label>
              <span className="text-xs text-muted-foreground">{features.length} added</span>
            </div>
            <div className="flex gap-2">
              <Input
                id="feature-input"
                placeholder="e.g. Rooftop garden, Backup generator… then press Enter"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const val = featureInput.trim().replace(/,$/, "");
                    if (val && !features.includes(val) && features.length < 30) {
                      setFeatures((prev) => [...prev, val]);
                    }
                    setFeatureInput("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  const val = featureInput.trim().replace(/,$/, "");
                  if (val && !features.includes(val) && features.length < 30) {
                    setFeatures((prev) => [...prev, val]);
                  }
                  setFeatureInput("");
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-muted/20 p-3">
                {features.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {f}
                    <button
                      type="button"
                      onClick={() => setFeatures((prev) => prev.filter((x) => x !== f))}
                      className="ml-0.5 rounded-full hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe the property…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-semibold text-amber-700">Owner Information</p>
              <span className="ml-auto text-xs text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">Dashboard only · not public</span>
            </div>
            <p className="text-xs text-amber-600 -mt-2">
              This information is private and will never be shown to buyers or visitors.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  placeholder="Full name"
                  value={form.ownerName}
                  onChange={(e) => set("ownerName", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ownerProfession">Profession</Label>
                <Input
                  id="ownerProfession"
                  placeholder="e.g. Business Owner, Doctor…"
                  value={form.ownerProfession}
                  onChange={(e) => set("ownerProfession", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ownerAddress">Owner Address</Label>
              <Input
                id="ownerAddress"
                placeholder="Owner's home or office address"
                value={form.ownerAddress}
                onChange={(e) => set("ownerAddress", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ownerPhone">Contact Number</Label>
                <Input
                  id="ownerPhone"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  value={form.ownerPhone}
                  onChange={(e) => set("ownerPhone", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ownerEmail">Owner Email</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="owner@example.com"
                  value={form.ownerEmail}
                  onChange={(e) => set("ownerEmail", e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending || isUploadingAny}>
              {mutation.isPending
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Create listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
