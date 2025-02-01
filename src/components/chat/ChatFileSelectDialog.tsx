"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

const checkboxesSchema = z.object({
  files: z.array(z.string()).refine((value) => value.some((file) => file), {
    message: "You have to select at least one file.",
  }),
});

type ChatFileSelectDialogProps = {
  onFilesSelected: (files: string[]) => void;
  children: React.ReactNode;
};

const files = [
  { id: "1", name: "File 1", added: new Date() },
  { id: "2", name: "File 2", added: new Date() },
  { id: "3", name: "File 3", added: new Date() },
  { id: "4", name: "File 4", added: new Date() },
  { id: "5", name: "File 5", added: new Date() },
  { id: "6", name: "File 6", added: new Date() },
  { id: "7", name: "File 7", added: new Date() },
  { id: "8", name: "File 8", added: new Date() },
  { id: "9", name: "File 9", added: new Date() },
  { id: "10", name: "File 10", added: new Date() },
];

export function ChatFileSelectDialog({
  children,
  onFilesSelected,
}: ChatFileSelectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof checkboxesSchema>>({
    resolver: zodResolver(checkboxesSchema),
    defaultValues: {
      files: [],
    },
  });

  function onSubmit({
    files: selectedFiles,
  }: z.infer<typeof checkboxesSchema>) {
    onFilesSelected(selectedFiles);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select files</DialogTitle>
          <DialogDescription>
            Select the files you want to use for this conversation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem>
                  {files.map((file) => (
                    <FormField
                      key={file.id}
                      control={form.control}
                      name="files"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={file.id}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(file.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, file.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== file.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="pb-1.5">
                              {file.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
