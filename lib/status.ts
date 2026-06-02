export const applicationStatuses = [
  "Pending",
  "Reviewing",
  "Documents Required",
  "Processing",
  "Approved",
  "Rejected",
  "Completed",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && applicationStatuses.includes(value as ApplicationStatus);
}
