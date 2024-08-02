import { ChatMessages } from "@/components/ChatMessages";
import { ChatPromptInput } from "@/components/ChatPromptInput";

export default async function Chat() {
  return (
    <main className="flex h-full flex-col justify-between">
      <h1 className="text-xl font-semibold">
        You&apos;re looking at the chat page.
      </h1>

      <ChatMessages />
      <ChatPromptInput />
    </main>
  );
}
