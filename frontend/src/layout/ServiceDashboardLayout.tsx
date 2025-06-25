import TicketForm from "@/components/forms/ticket-form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ServiceDashboardView() {
    return (
        <Tabs defaultValue="create" className="w-full">
            <TabsList>
                <TabsTrigger value="create">Create a Ticket</TabsTrigger>
                <TabsTrigger value="history">View Ticket History</TabsTrigger>
            </TabsList>

            <Card className="p-6">
                <TabsContent value="create">
                    <TicketForm />
                </TabsContent>
                <TabsContent value="history">
                    View Ticket History here.
                </TabsContent>
            </Card>
        </Tabs>
    );
}
