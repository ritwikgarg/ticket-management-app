import { getTicketList } from "@/api/ticket/ticket-api";
import KanbanBoard from "@/components/layout/KanbanBoard";
import { MultipleContainers } from "@/components/layout/TestBoard";
import { TicketCard } from "@/components/ticket/Card";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Ticket } from "@/models/Ticket";
import { useEffect, useState } from "react";

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
        <Tabs defaultValue="tickets" className="w-full">
            <TabsList>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <Card className="p-6">
                <TabsContent value="tickets">
                    {/* <div className="p-6 min-h-screen bg-background flex flex-col items-center gap-4">
                        {tickets.map((ticket) => (
                            <TicketCard {...ticket} />
                        ))}
                    </div> */}
                    {/* <KanbanBoard></KanbanBoard> */}
                    <MultipleContainers/>
                </TabsContent>
                <TabsContent value="analytics">
                    View Ticket Analytics here.
                </TabsContent>
            </Card>
        </Tabs>
    );
}
