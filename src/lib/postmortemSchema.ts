
import { z } from "zod";

const postmortemText = z
  .string()
  .trim()
  .min(15, "Please enter at least 15 characters.")
  .max(2500, "Maximum 2500 characters allowed.");

export const postmortemSchema = z.object({
  technicalChallenges: postmortemText,
  lessonsLearned: postmortemText,
  recommendedNextSteps: postmortemText,
});
