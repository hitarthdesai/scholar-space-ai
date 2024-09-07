import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SolutionEditor } from "./SolutionEditor";
import { Button } from "../ui/button";
import { SendHorizonalIcon } from "lucide-react";
import { QuestionTabs } from "./QuestionTabs";
import { RunCodeButton } from "./RunCodeButton";
import { CodeProvider } from "@/contexts/CodeContext";
import { OutputSection } from "./OutputSection";
import { getObject } from "@/utils/storage/s3/getObject";

type QuestionProps = {
  questionId: string;
};

export function Question({ questionId }: QuestionProps) {
  const questionText = getObject({ fileName: `questions/${questionId}` });
  return (
    <CodeProvider questionId={questionId}>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex h-full w-full gap-2"
      >
        <ResizablePanel
          minSize={25}
          defaultSize={50}
          className="flex h-full w-full flex-col items-center justify-between gap-2"
        >
          <div className="min-h-20 w-full rounded-t-md border p-2">
            {questionText}
          </div>
          <div className="w-full grow">
            <SolutionEditor />
          </div>
          <div className="flex w-full items-center gap-2">
            <Button className="mr-auto flex items-center justify-center gap-2 bg-green-700 text-white hover:bg-green-300 hover:text-black">
              Submit <SendHorizonalIcon aria-hidden />
            </Button>
            {/* <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              Save <SaveIcon aria-hidden />
            </Button> */}
            <RunCodeButton />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={20} defaultSize={50}>
          <ResizablePanelGroup
            direction="vertical"
            className="flex h-full w-full flex-col gap-2"
          >
            <ResizablePanel
              minSize={20}
              defaultSize={20}
              className="flex h-full w-full flex-col items-center justify-between gap-2 rounded-md border p-2"
            >
              <OutputSection />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80} minSize={50}>
              <QuestionTabs questionId={questionId} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </CodeProvider>
  );
}
