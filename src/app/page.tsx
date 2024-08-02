import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/utils/auth/config";
import {
  BarChartIcon,
  QuestionMarkIcon,
  TargetIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

export default async function Home() {
  const isLoggedIn = Boolean(await auth());
  if (!isLoggedIn) return null;

  return (
    <main className="grid min-h-full w-screen grid-cols-2 grid-rows-2 flex-row gap-4 px-6">
      <Link href="/dashboard" className="col-span-2">
        <Card className="flex h-full flex-col justify-between hover:bg-secondary">
          <CardHeader>
            <CardTitle className="">Dashboard</CardTitle>
            <CardDescription className="">
              Explore an overview of your topic-wise progress and upcoming
              tasks.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <Button variant="ghost">
              <BarChartIcon className="mr-1" />
              View Dashboard
            </Button>
          </CardFooter>
        </Card>
      </Link>
      <Link href="/qa">
        <Card className="flex h-full flex-col justify-between hover:bg-secondary">
          <CardHeader>
            <CardTitle className="">Q/A</CardTitle>
            <CardDescription className="">
              Get your questions answered by our chatbot.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <Button variant="ghost">
              <QuestionMarkIcon className="mr-1" />
              Ask a question
            </Button>
          </CardFooter>
        </Card>
      </Link>
      <Link href="/practice">
        <Card className="flex h-full flex-col justify-between hover:bg-secondary">
          <CardHeader>
            <CardTitle className="">Practice</CardTitle>
            <CardDescription className="">
              Solve questions and improve your skills.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <Button variant="ghost">
              <TargetIcon className="mr-1" />
              Practice questions
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </main>
  );
}
