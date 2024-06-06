import { use } from "react";
import * as z from "zod";

export const BlinkValidation = z.object({
  blink: z.string().min(3, "Blink must be at least 3 characters long"),
  accountId: z.string(),
});

export const CommentValidation = z.object({
    blink: z.string().min(3, "Blink must be at least 3 characters long")
  });