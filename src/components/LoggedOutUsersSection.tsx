import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UserSections() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-start gap-12 text-center md:grid-cols-2 md:text-left">
          {/* For Tutors Section */}
          <div className="flex flex-col space-y-4">
            <div className="inline-block self-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary md:self-start">
              For Tutors
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Empower Your Teaching
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Create engaging coding classrooms, design custom assignments, and
              track student progress with our comprehensive tools.
            </p>
            <ul className="grid gap-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Create and manage multiple classrooms</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Design coding assignments with automated grading</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Track student progress and performance</span>
              </li>
            </ul>
          </div>

          {/* For Students Section */}
          <div className="flex flex-col space-y-4">
            <div className="inline-block self-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary md:self-start">
              For Students
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Learn Coding the Right Way
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join interactive classrooms, practice with real-world coding
              assignments, and get AI-powered assistance when you need it.
            </p>
            <ul className="grid gap-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Access interactive coding environments</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Get instant feedback on your code</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Learn with AI-powered coding assistance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
