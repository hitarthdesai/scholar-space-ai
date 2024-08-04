import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatBubbleIcon, EyeNoneIcon } from "@radix-ui/react-icons";

export function NotAuthorizedToViewConversation() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <EyeNoneIcon className="h-24 w-24 text-gray-400" aria-hidden />
      <p className="max-w-48 text-center">
        You're not authorized to view this conversation.
      </p>
      <div className="mt-4 flex gap-1">
        <Button variant="outline">
          <Link href="/">Go to homepage</Link>
        </Button>
        <Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2"
          >
            Get help <ChatBubbleIcon />
          </Link>
        </Button>
      </div>
    </main>
  );
}
