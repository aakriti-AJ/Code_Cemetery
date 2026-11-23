
import { z } from "zod";

const textList = z.array(
  z.string().trim().min(1).max(300)
).max(30);

const githubUrlSchema = z
  .url("Enter a valid GitHub repository URL.")
  .refine((value) => {
    try {
      const url = new URL(value);

      const parts = url.pathname
        .split("/")
        .filter(Boolean);

      return (
        url.protocol === "https:" &&
        url.hostname === "github.com" &&
        !url.username &&
        !url.password &&
        !url.port &&
        !url.search &&
        !url.hash &&
        parts.length === 2 &&
        parts.every((part) =>
          /^[a-zA-Z0-9_.-]+$/.test(part)
        )
      );
    } catch {
      return false;
    }
  }, "Enter a GitHub URL like https://github.com/owner/repository");

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Project title must contain at least 3 characters.")
    .max(100),

  description: z
    .string()
    .trim()
    .min(15, "Provide at least 15 characters describing the project.")
    .max(4000),

  githubUrl: z.union([githubUrlSchema, z.literal("")]),
  sourceType: z.enum(["GITHUB", "CUSTOM"]).default("GITHUB"),
  archivePath: z.string().max(320).default(""),
  availableForPurchase: z.boolean().default(false),

  technologies: z
    .array(z.string().trim().min(1).max(60))
    .min(1, "Add at least one technology.")
    .max(20),

  category: z
    .string()
    .trim()
    .min(2, "Select or enter a project category.")
    .max(60),

  completionPercentage: z
    .number()
    .int()
    .min(0)
    .max(100),

  causeOfAbandonment: z
    .string()
    .trim()
    .min(10, "Explain why the project was abandoned.")
    .max(2000),

  workingFeatures: textList,
  incompleteFeatures: textList,
  knownIssues: textList,
  requiredSkills: textList,

  status: z.enum([
    "DRAFT",
    "BURIED",
    "LOOKING_FOR_REVIVAL",
  ]),
}).refine(value => value.sourceType === "CUSTOM" || Boolean(value.githubUrl), {message:"A GitHub project requires a repository URL.",path:["githubUrl"]});
