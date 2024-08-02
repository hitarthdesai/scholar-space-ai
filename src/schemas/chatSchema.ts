import { z } from "zod";

export const promptSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters"),
});

export type PromptInput = z.infer<typeof promptSchema>;
