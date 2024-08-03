import { Chat } from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { auth } from "@/utils/auth/config";
import { LockClosedIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function ChatPage() {
  const session = await auth();
  if (!session) {
    return (
      <main className="flex h-full w-full flex-col items-center justify-center">
        <LockClosedIcon className="h-24 w-24 text-gray-400" aria-hidden />
        <p className="max-w-48 text-center">
          AI Chat is only available to signed in users
        </p>
        <div className="mt-4 flex gap-1">
          <Button variant="outline">
            <Link href="/">Go to homepage</Link>
          </Button>
          <Button>
            <Link href="/login">Log in now</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-full flex-col justify-between">
      <Chat />
    </main>
  );
}
