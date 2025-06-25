import { MultipleContainers } from "@/components/layout/TestBoard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

export function AdminDashboard() {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return (
        <div className="w-full flex text-left md:gap-y-4 flex-col gap-y-4">
            <div className="w-full text-left">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-normal">
                    Welcome, {user.first_name}!
                </h3>
                <span className="text-muted-foreground text-sm">
                    Here’s your dashboard overview.
                </span>
            </div>

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
                        <MultipleContainers />
                    </TabsContent>
                    <TabsContent value="analytics">
                        View Ticket Analytics here.
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    );
}
