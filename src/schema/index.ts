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
  title: z.string(),
  url: z.string(),
  priority: z.number(),
  description: z.string(),
  patterns: z.array(searchFormSchema),
});
export const atariRulesSchema = z.array(atariRuleSchema);

export const manualImportFormSchema = z.object({
  laneText: z
    .string()
    .regex(/^[1-7]{7}$/, "1-7の数字のみを7桁で入力してください")
    .refine(validateDuplicate, { message: "重複している数字があります" }),
  expiration: z.string().optional(),
});
export type ManualImportFormValues = z.infer<typeof manualImportFormSchema>;
