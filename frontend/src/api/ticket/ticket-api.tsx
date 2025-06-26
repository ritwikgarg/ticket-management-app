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

export const createTicket = (
    data: Ticket
): Promise<{ data?: Ticket; message?: string }> => {
    console.log(data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ data });
        }, 2000);
    });
};

export async function updateTicket(
    ticket: Ticket
): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`PUT /api/ticket/${ticket.ticketId}`);
            resolve({ success: true });
        }, 1500); // Simulated network delay
    });
}

export const getTicketDetails = (
    ticketId: string
): Promise<{ data: Ticket }> => {
    const user: User = {
        employee_id: "57264",
        first_name: "Ritwik",
        last_name: "Garg",
        role: Role.SOLVER,
        email: "ritwik.garg@merai.co",
        contact_no: "8291620011",
    };

    return new Promise((resolve, reject) => {
        const data: Ticket = {
            ticketId,
            createdBy: "blahBlah@example.com",
            hospitalName: "City Hospital",
            systemId: "SYS-123",
            surgeonName: "Dr. Smith",
            ticketCreationDate: new Date(),
            ticketLastUpdatedDate: new Date(),
            priority: Priority.HIGH,
            status: Status.OPEN,
            issues: issueMap,
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
                new File(["info"], "log.txt", { type: "text/plain" }),
                new File(["image"], "xray.jpeg", { type: "image/jpeg" }),
                new File(["sheet"], "finance.xlsx", {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }),
                new File(["more text"], "details.txt", { type: "text/plain" }),
                new File(["doc"], "protocol.pdf", { type: "application/pdf" }),
                new File(["code"], "script.js", {
                    type: "application/javascript",
                }),
                new File(["json"], "config.json", { type: "application/json" }),
                new File(["presentation"], "slides.pptx", {
                    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                }),
                new File(["design"], "mockup.svg", { type: "image/svg+xml" }),
            ],
            assignedTo: [user],
            comments: "Handled with urgency.",
        };
        setTimeout(() => {
            resolve({ data });
        }, 2000);
    });
};

export const getTicketList = (
    assignedTo?: string
): Promise<{ data: Ticket[] }> => {
    const ticket: Ticket = {
        ticketId: "BLAH123",
        hospitalName: "CityCare Hospital",
        systemId: "SYS-2341",
        ticketCreationDate: new Date(),
        priority: Priority.HIGH,
        status: Status.OPEN,
        createdBy: "blahBlah@example.com",
        issues: issueMap,
    };

    const statuses = Object.values(Status);
    const priorities = Object.values(Priority);

    const tickets: Ticket[] = Array.from({ length: 10 }).map((_, i) => ({
        ...ticket,
        ticketId: `TICKET-${i + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
    })) as Ticket[];

    return new Promise((resolve, reject) => {
        const data: Ticket[] = tickets;
        setTimeout(() => {
            resolve({ data });
        }, 2000);
    });
};
