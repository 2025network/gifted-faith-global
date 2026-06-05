export const applicationStatuses = [
  "Pending",
  "Under Review",
  "Approved",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && applicationStatuses.includes(value as ApplicationStatus);
}
