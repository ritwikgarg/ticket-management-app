// src/schemas/IssueSchema.ts
import { z } from "zod/v4";
import { issueMetadata } from "@/enums/ticket/IssueMetadata";

// --- Extracting Types for Zod Schema ---
// Get the union of all top-level issue categories (e.g., 'hardware' | 'software' | 'other')
export type IssueCategory = keyof typeof issueMetadata;

// Helper to extract subcategory keys for a given category
type SubcategoryKeys<C extends IssueCategory> = keyof typeof issueMetadata[C];

// --- Zod Schema Definition ---

/**
 * Dynamically generates the Zod schema for a ticket issue.
 * It iterates over the 'issueMetadata' to create discriminated union members,
 * ensuring both category and subcategory values come from a single source of truth.
 *
 * - The 'category' literal is derived from 'issueMetadata' keys.
 * - The 'subcategory' enum is dynamically populated based on the specific category.
 * - For the 'other' category, 'subcategory' is optional and can be undefined or null.
 */
const discriminatedUnionMembers = (Object.keys(issueMetadata) as Array<IssueCategory>).map(
  (categoryKey) => {
    // If the category is 'other', it has no subcategories
    if (categoryKey === "other") {
      return z.object({
        category: z.literal(categoryKey), // Dynamically set the literal category
        subcategory: z.undefined().or(z.null()).optional(), // Subcategory is optional for 'other'
      });
    } else {
      // For 'hardware' or 'software', dynamically get subcategory keys
      const subcategoryValues = Object.keys(issueMetadata[categoryKey]);
      return z.object({
        category: z.literal(categoryKey), // Dynamically set the literal category
        subcategory: z.enum(subcategoryValues as [
          SubcategoryKeys<typeof categoryKey>, // Type assertion to ensure literal types for Zod enum
          ...Array<SubcategoryKeys<typeof categoryKey>>
        ]),
      });
    }
  }
) as unknown as [ // This type assertion is necessary for Zod's discriminatedUnion to correctly infer the union type
  z.ZodObject<any>, // At least one member is required
  ...Array<z.ZodObject<any>> // And then any number of subsequent members
];

export const issueSchema = z.discriminatedUnion("category", discriminatedUnionMembers);

// Infer the TypeScript type from the Zod schema
export type ZodIssueType = z.infer<typeof issueSchema>;
