import type { IssueMap } from "@/enums/ticket/Issue";
import type { Priority } from "../enums/ticket/Priority";
import type { Status } from "../enums/ticket/Status";
import type { User } from "./User";

export interface Ticket {
    ticketId?: string;
    createdBy?: string;
    systemId?: string;
    hospitalName?: string;
    surgeonName?: string;
    priority?: Priority;
    status?: Status;
    ticketCreationDate?: Date;
    ticketLastUpdatedDate?: Date;
    issues?: IssueMap;
    issueDescription?: string;
    surgeonComment?: string;
    attachments?: File[];
    assignedTo?: User[];
    comments?: string;
}
