import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatBubbleIcon, EyeNoneIcon } from "@radix-ui/react-icons";

export function NotAuthorizedToViewPage() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <EyeNoneIcon className="h-24 w-24 text-gray-400" aria-hidden />
      <p className="max-w-48 text-center">
        You&apos;re not authorized to view this page.
      </p>
      <div className="mt-4 flex gap-1">
        <Link href="/">
          <Button variant="outline">Go to homepage</Button>
        </Link>
        <Link href="/login">
          <Button className="flex items-center justify-center gap-2">
            Get help <ChatBubbleIcon />
          </Button>
        </Link>
      </div>
    </main>
  );
}
