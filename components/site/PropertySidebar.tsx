"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarAuthSkeleton } from "@/components/site/Skeletons";
import { ContactAgentDialog, RequestTourDialog } from "@/components/site/PropertyContactDialogs";
import { useAuth } from "@/hooks/use-auth";
import { getOptimizedImageUrl } from "@/lib/utils";

type Props = {
  propertyId: string;
  propertyAddress: string;
  agentId: string | null;
  agentName: string;
  agentPhone: string;
  agentAvatarUrl?: string | null;
  area?: string;
};

export function PropertySidebar({
  propertyId,
  propertyAddress,
  agentId,
  agentName,
  agentPhone,
  agentAvatarUrl,
  area,
}: Props) {
  const { user, loading: authLoading } = useAuth();
  const isAuthed = !!user;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {/* Agent Info Card */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="text-xs text-muted-foreground">Listed by</div>
        <div className="mt-3 flex flex-col items-center text-center">
          {agentAvatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={getOptimizedImageUrl(agentAvatarUrl)}
              alt={agentName}
              className="h-20 w-20 rounded-full border-2 border-white object-cover shadow"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold border-2 border-white shadow">
              {agentName[0]?.toUpperCase() ?? "A"}
            </div>
          )}
          <div className="mt-3 font-semibold text-primary">{agentName}</div>
          <div className="text-sm text-muted-foreground">Panpata Verified Agent</div>
          {agentPhone && (
            <div className="mt-1 text-xs text-muted-foreground">{agentPhone}</div>
          )}
        </div>

        {authLoading ? (
          <SidebarAuthSkeleton />
        ) : isAuthed ? (
          <ContactAgentDialog
            agentId={agentId ?? ""}
            agentName={agentName}
            agentPhone={agentPhone}
            area={area}
            trigger={
              <Button
                variant="outline"
                className="mt-4 w-full rounded-md border-primary text-primary hover:bg-primary/10"
              >
                Contact {agentName.split(" ")[0]}
              </Button>
            }
          />
        ) : (
          <Link href="/login" className="mt-4 block">
            <Button
              variant="outline"
              className="w-full rounded-md border-primary text-primary hover:bg-primary/10"
            >
              <Lock className="mr-2 h-4 w-4" /> Sign in to contact
            </Button>
          </Link>
        )}
      </div>

      {/* Request Tour Card */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        {authLoading ? (
          <SidebarAuthSkeleton />
        ) : isAuthed ? (
          <RequestTourDialog
            propertyId={propertyId}
            propertyAddress={propertyAddress}
            trigger={
              <Button className="h-12 w-full flex-col gap-0.5 rounded-md text-base font-bold leading-tight">
                <span>Request a tour</span>
                <span className="text-[11px] font-normal opacity-90">
                  as early as today at 11:30 am
                </span>
              </Button>
            }
          />
        ) : (
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in to request a tour and unlock agent details.
            </p>
            <Link href="/login">
              <Button className="h-12 w-full rounded-md text-base font-bold">
                <Lock className="mr-2 h-4 w-4" /> Sign in to request a tour
              </Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
