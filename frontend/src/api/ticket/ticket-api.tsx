// ticket-api.ts
import type { IssueMap } from "@/enums/ticket/Issue";
import { Priority } from "@/enums/ticket/Priority";
import { Status } from "@/enums/ticket/Status";
import { Role } from "@/enums/user/Role";
import type { Ticket } from "@/models/Ticket";
import type { User } from "@/models/User";

const issueMap: IssueMap = {
    hardware: ["motor", "robot_arm"],
    software: ["gap_check"],
    other: [],
};

const user: User = {
    employee_id: "57264",
    first_name: "Ritwik",
    last_name: "Garg",
    role: Role.SOLVER,
    email: "ritwik.garg@merai.co",
    contact_no: "8291620011",
};

// Shared ticket store
let ticketStore: Ticket[] | null = null;

function generateTickets(): Ticket[] {
    const baseTicket: Ticket = {
        ticketId: "",
        hospitalName: "",
        systemId: "",
        ticketCreationDate: new Date(),
        priority: Priority.HIGH,
        status: Status.OPEN,
        createdBy: "blahBlah@example.com",
        issues: issueMap,
        assignedTo: [user],
        comments: ["Hello"],
        attachments: [],
    };

    const statuses = Object.values(Status);
    const priorities = Object.values(Priority);
    const hospitalNames = [
        "Apollo",
        "Fortis",
        "AIIMS",
        "Max Healthcare",
        "Narayana",
        "Medanta",
        "Kokilaben",
        "Care Hospitals",
        "Manipal",
        "Global",
    ];
    const prefix = ["SYS"];

    return Array.from({ length: 10 }).map((_, i) => ({
        ...baseTicket,
        ticketId: `TICKET-${i + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        hospitalName:
            hospitalNames[Math.floor(Math.random() * hospitalNames.length)],
        systemId: `${
            prefix[Math.floor(Math.random() * prefix.length)]
        }-${Math.floor(1000 + Math.random() * 9000)}`,
        ticketCreationDate: new Date(),
        ticketLastUpdatedDate: new Date(),
        issueDescription: "Issue details here...",
        surgeonComment: "Please resolve quickly.",
        attachments: [
            new File(["dummy content"], "report.pdf", {
                type: "application/pdf",
            }),
            new File(["more content"], "photo.png", { type: "image/png" }),
            new File(["notes"], "summary.docx", {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }),
            new File(["data"], "table.csv", { type: "text/csv" }),
        ],
    }));
}

export const getTicketList = async (): Promise<{ data: Ticket[] }> => {
    if (!ticketStore) {
        ticketStore = generateTickets();
    }
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: ticketStore! }), 1000);
    });
};

export const getTicketDetails = async (
    ticketId: string
): Promise<{ data: Ticket }> => {
    if (!ticketStore) {
        ticketStore = generateTickets();
    }
    const ticket = ticketStore.find((t) => t.ticketId === ticketId);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (ticket) {
                resolve({ data: ticket });
            } else {
                reject(new Error("Ticket not found"));
            }
        }, 1000);
    });
};

export async function updateTicket(
    updated: Ticket
): Promise<{ success: boolean; data: Ticket }> {
    if (!ticketStore) {
        ticketStore = generateTickets();
    }
    const index = ticketStore.findIndex((t) => t.ticketId === updated.ticketId);
    if (index !== -1) {
        ticketStore[index] = updated;
    } else {
        ticketStore.push(updated);
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`PUT /api/ticket/${updated.ticketId}`);
            resolve({ success: true, data: updated });
        }, 1000);
    });
}

export const createTicket = (
    data: Ticket
): Promise<{ data?: Ticket; message?: string }> => {
    if (!ticketStore) {
        ticketStore = generateTickets();
    }
    ticketStore.push(data);
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data }), 1000);
    });
};
