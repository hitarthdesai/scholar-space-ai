import { Card } from "@/components/ui/card";
import { GraduationCap, FileCode, Code } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="w-full bg-muted/50 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Learning Tools
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to teach and learn coding effectively
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col items-center justify-center p-6 text-center shadow-md">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Virtual Classrooms</h3>
            <p className="text-muted-foreground">
              Create and manage interactive coding classrooms
            </p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 text-center shadow-md">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <FileCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Coding Assignments</h3>
            <p className="text-muted-foreground">
              Design custom coding challenges and assignments
            </p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 text-center shadow-md">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">AI-Powered Coding</h3>
            <p className="text-muted-foreground">
              Get help from AI assistants while solving problems
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
