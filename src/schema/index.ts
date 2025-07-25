import { z } from "zod";

const validateDuplicate = (val: string) => {
  const digits = val.replace(/\*/g, "");
  const uniqueDigits = new Set(digits);
  return uniqueDigits.size === digits.length;
};

export const searchFormSchema = z.object({
  scratchSideText: z
    .string()
    .max(3, "3文字以内で入力してください")
    .regex(/^[1-7*]*$/, "指定できるのは1-7と*だけです")
    .refine(validateDuplicate, { message: "重複している鍵盤があります" }),
  isScratchSideUnordered: z.boolean(),
  nonScratchSideText: z
    .string()
    .max(4, "4文字以内で入力してください")
    .regex(/^[1-7*]*$/, "指定できるのは1-7と*だけです")
    .refine(validateDuplicate, { message: "重複している鍵盤があります" }),
  isNonScratchSideUnordered: z.boolean(),
});
export type SearchFormValues = z.infer<typeof searchFormSchema>;

export const atariRuleSchema = z.object({
  id: z.string(),
  songTitle: z.string(),
  textageURL: z.string(),
  priority: z.number(),
  description: z.string(),
  patterns: z.array(searchFormSchema),
});
export const atariRulesSchema = z.array(atariRuleSchema);
