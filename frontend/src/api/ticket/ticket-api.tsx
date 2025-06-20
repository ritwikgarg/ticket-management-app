import type { IssueMap } from "@/enums/ticket/Issue";
import { Priority } from "@/enums/ticket/Priority";
import { Status } from "@/enums/ticket/Status";
import type { Ticket } from "@/models/Ticket";

const issueMap: IssueMap = {
        hardware: ["motor", "robot_arm"],
        software: ["gap_check"],
        other: [],
    };

export const createTicket = (
    data: Ticket
): Promise<{ data?: Ticket; message?: string }> => {
    console.log(data)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ data });
        }, 2000)
    })
}

export const getTicketDetails = (ticketId: string): Promise<{ data: Ticket }> => {
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
            status: Status.SOLVED,
            issues: issueMap,
            issueDescription: "Issue details here...",
            surgeonComment: "Please resolve quickly.",
            attachments: [new File(["dummy content"], "report.pdf", { type: "application/pdf" }),
            new File(["more content"], "photo.png", { type: "image/png" }),
            new File(["notes"], "summary.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
            new File(["data"], "table.csv", { type: "text/csv" }),
            new File(["info"], "log.txt", { type: "text/plain" }),
            new File(["image"], "xray.jpeg", { type: "image/jpeg" }),
            new File(["sheet"], "finance.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
            new File(["more text"], "details.txt", { type: "text/plain" }),
            new File(["doc"], "protocol.pdf", { type: "application/pdf" }),
            new File(["code"], "script.js", { type: "application/javascript" }),
            new File(["json"], "config.json", { type: "application/json" }),
            new File(["presentation"], "slides.pptx", { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }),
            new File(["design"], "mockup.svg", { type: "image/svg+xml" })
            ],
            assignedTo: "tech@example.com",
            comments: "Handled with urgency.",
        }
        setTimeout(() => {
            resolve({ data })
        }, 2000)
    })
}

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

    const tickets: Ticket[] = Array.from({ length: 5 }).map((_, i) => ({
        ...ticket,
        ticketId: `TICKET-${i + 1}`,
    })) as Ticket[];


    return new Promise((resolve, reject) => {
        const data: Ticket[] = [ticket]
        setTimeout(() => {
            resolve({ data });
        }, 2000)
    })
}
