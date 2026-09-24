export type CustomerIncidentStatus =
    | "PROCESSING"
    | "WAITING_RESPONSE"
    | "RESOLVED"
    | "CANCELLED";

export type CustomerIncidentPriority =
    | "HIGH"
    | "MEDIUM"
    | "LOW";

export interface CustomerIncidentItem {
    id: string;

    incidentCode: string;

    contractId: string;
    contractCode: string;

    equipmentId: string;
    equipmentCode: string;
    equipmentName: string;
    equipmentImageUrl: string;

    branch: string;

    title: string;
    description: string;

    priority: CustomerIncidentPriority;

    status: CustomerIncidentStatus;

    attachmentCount: number;

    reportedAt: string;

    resolvedAt?: string;

    note?: string;

    createdAt: string;
}