import Link from "next/link";

export function TalkToAgent() {
  return (
    <section className="bg-[#f2f2f2] py-16 text-center">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          Talk to a{" "}
          <span className="text-primary">panpata</span>{" "}
          agent
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Tell us about your selling goals. we&apos;ll help you reach them.
        </p>
        <Link
          href="/agents"
          className="mt-6 inline-block rounded-full border border-primary px-8 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          call/messages
        </Link>
      </div>
    </section>
  );
}
