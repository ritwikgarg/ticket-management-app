import TicketForm from "@/components/forms/ticket-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ServiceDashboardView() {
    return (
        <Tabs defaultValue="create" className="w-full">
            <TabsList>
                <TabsTrigger value="create">Create a Ticket</TabsTrigger>
                <TabsTrigger value="history">View Ticket History</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
                <TicketForm/>
            </TabsContent>
            <TabsContent value="history">
                Change your password here.
            </TabsContent>
        </Tabs>
    );
}
