import type { issueMetadata } from "./IssueMetadata";

export type IssueCategory = keyof typeof issueMetadata

export type IssueMap = {
  [K in IssueCategory]: (keyof typeof issueMetadata[K])[];
};
