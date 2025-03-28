import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-b from-background to-background/80 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Revolutionizing Coding Education with AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Empower students and teachers with AI-driven tools for
                interactive learning, automated grading, and real-time coding
                assistance—all in one seamless platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" variant="default">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center pr-10">
            <Image
              src="/images/hero_image.webp"
              width={800}
              height={800}
              alt="Coding students collaborating"
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
