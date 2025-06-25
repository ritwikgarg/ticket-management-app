import { useEffect, useState } from "react";
import { getTicketList } from "@/api/ticket/ticket-api";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Ticket } from "@/models/Ticket";
import { MultipleContainers } from "@/components/layout/TestBoard";

export function SolverDashboardView() {

  return (
    <Tabs defaultValue="tickets" className="w-full">
      <TabsList>
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <Card className="p-6">
        <TabsContent value="tickets">
    
          <MultipleContainers/>
      
        </TabsContent>
        <TabsContent value="analytics">
          View Ticket Analytics here.
        </TabsContent>
      </Card>
    </Tabs>
  );
}
