import { z } from "zod";

const validateDuplicate = (val: string) => {
  const digits = val.replace(/\*/g, "");
  const uniqueDigits = new Set(digits);
  return uniqueDigits.size === digits.length;
};

export const searchFormSchema = z.object({
  scratchSideText: z
    .string()
    .length(3, "3文字で指定してください")
    .regex(/^[1-7*]*$/, "指定できるのは1-7と*だけです")
    .refine(validateDuplicate, { message: "重複している鍵盤があります" }),
  nonScratchSideText: z
    .string()
    .length(4, "4文字で指定してください")
    .regex(/^[1-7*]*$/, "指定できるのは1-7と*だけです")
    .refine(validateDuplicate, { message: "重複している鍵盤があります" }),
  isScratchSideUnordered: z.boolean(),
  isNonScratchSideUnordered: z.boolean(),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
