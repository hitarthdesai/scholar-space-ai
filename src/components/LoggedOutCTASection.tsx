import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="w-full bg-primary py-12 text-primary-foreground md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Start Teaching or Learning?
            </h2>
            <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join India's most innovative coding education platform today.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
