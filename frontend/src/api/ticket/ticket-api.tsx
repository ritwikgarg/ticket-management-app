import type { Ticket } from "@/models/Ticket";

export const createTicket = (
    data:Ticket
): Promise<{success: boolean, data?: Ticket; message?: string}> => {
    console.log(data) 
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({success: true, data});
        }, 2000)
    })
}
