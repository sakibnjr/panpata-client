"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
const Logo = ({ onClick }: { onClick?: () => void }) => (
  <Link href="/" onClick={onClick} className="flex items-center">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/assets/logo.png" alt="Panpata" className="h-13 w-auto object-contain" />
  </Link>
);

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, clearUser } = useAuth();
  const router = useRouter();
  const linkCls =
    "text-base font-normal text-foreground/80 hover:text-primary";
  const close = () => setOpen(false);
  const signOut = () => {
    clearUser();
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <header className="sticky inset-x-0 top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-6 md:flex md:justify-between">
        {/* Left: hamburger on mobile, logo on desktop */}
        <div className="flex items-center justify-start md:contents">
          <Sheet open={open} onOpenChange={setOpen}>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/80 md:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <SheetContent
              side="left"
              className="w-screen max-w-none border-0 bg-white p-0 sm:max-w-none [&>button.absolute]:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b px-4">
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={close}
                    className="inline-flex h-10 w-10 items-center justify-center justify-self-start rounded-md text-foreground/80 hover:text-primary"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <SheetTitle asChild>
                    <Logo onClick={close} />
                  </SheetTitle>
                  <span />
                </div>
                <nav className="px-5 py-6">
                  <ul className="flex flex-col gap-1">
                    <li><Link href="/buy" onClick={close} className={`${linkCls} block py-3`}>Buy</Link></li>
                    <li><Link href="/agents" onClick={close} className={`${linkCls} block py-3`}>Find My Agent</Link></li>
                    <li><Link href="/advertisement" onClick={close} className={`${linkCls} block py-3`}>Advertisement</Link></li>
                    <li><Link href="/land-share" onClick={close} className={`${linkCls} block py-3`}>Land Share Project</Link></li>
                  </ul>
                  {user ? (
                    <Button onClick={() => { close(); signOut(); }} variant="outline" className="mt-6 w-full rounded-full text-base font-normal">
                      Sign out
                    </Button>
                  ) : (
                    <Button asChild onClick={close} className="mt-6 w-full rounded-full text-base font-normal">
                      <Link href="/login">Sign in</Link>
                    </Button>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Center on mobile, part of left on desktop */}
        <div className="justify-self-center md:hidden">
          <Logo />
        </div>
        <div className="hidden md:block">
          <Logo />
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/buy" className={linkCls}>Buy</Link>
          <Link href="/agents" className={linkCls}>Find My Agent</Link>
          <Link href="/advertisement" className={linkCls}>Advertisement</Link>
          <Link href="/land-share" className={linkCls}>Land Share Project</Link>
          {user ? (
            <Button onClick={signOut} variant="outline" className="rounded-full px-6 text-base font-normal">Sign out</Button>
          ) : (
            <Button asChild className="rounded-full px-6 text-base font-normal"><Link href="/login">Sign in</Link></Button>
          )}
        </nav>

        {/* Right: sign in on mobile */}
        <div className="justify-self-end md:hidden">
          {user ? (
            <Button onClick={signOut} variant="outline" className="rounded-full px-4 text-sm font-normal">
              Sign out
            </Button>
          ) : (
            <Button asChild className="rounded-full px-4 text-sm font-normal">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
