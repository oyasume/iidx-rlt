import { z } from "zod";

const validateDuplicate = (val: string) => {
  const digits = val.replace(/\*/g, "");
  const uniqueDigits = new Set(digits);
  return uniqueDigits.size === digits.length;
};

const createLaneTextSchema = (length: number, allowWildcard: boolean) => {
  const regex = new RegExp(`^[1-7${allowWildcard ? "*" : ""}]*$`);
  const message = `指定できるのは1-7${allowWildcard ? "と*" : ""}だけです`;

  return z
    .string()
    .max(length, `${length}文字以内で入力してください`)
    .regex(regex, message)
    .refine(validateDuplicate, { message: "重複している鍵盤があります" });
};

export const searchFormSchema = z.object({
  scratchSideText: createLaneTextSchema(3, true),
  isScratchSideUnordered: z.boolean(),
  nonScratchSideText: createLaneTextSchema(4, true),
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
  laneText: createLaneTextSchema(7, false),
  expiration: z.string().optional(),
});
export type ManualImportFormValues = z.infer<typeof manualImportFormSchema>;
