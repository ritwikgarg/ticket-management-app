// pages/dashboard/SolverDashboardView.tsx
import { useEffect, useState } from "react";
import { TicketCard } from "@/components/ticket/Card";
import { getTicketList } from "@/api/ticket/ticket-api";
import type { Ticket } from "@/models/Ticket";

export function SolverDashboardView() {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    async function getTicketListData() {
        const fetchedTickets: Ticket[] = (await getTicketList()).data;
        setTickets(fetchedTickets);
    }

    useEffect(() => {
        getTicketListData();
    }, []);

    return (
        <div className="p-6 min-h-screen bg-background flex flex-col items-center gap-4">
            {tickets.map((ticket) => (
                <TicketCard
                    {...ticket}
                />
            ))}
        </div>
    );
}
