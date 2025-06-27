import { KanbanBoard } from "@/components/kanban-board/KanbanBoard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { SearchBar } from "@/components/kanban-board/SearchBar";
import { FilterDropdown } from "@/components/kanban-board/FilterDropdown";
import { useState } from "react";
import type { Priority } from "@/enums/ticket/Priority";

export function AdminDashboard() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<Priority | undefined>();


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
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
                              <div className="w-full">
                            <SearchBar onSearch={setSearchTerm}  />
                            </div>
                              <div className="w-full md:w-40">
                            <FilterDropdown onChange={(value) => setPriorityFilter(value)}/>
                                </div>
                        </div>
                        <KanbanBoard searchTerm={searchTerm} priorityFilter={priorityFilter} />
                    </TabsContent>
                    <TabsContent value="analytics">
                        View Ticket Analytics here.
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    );
}
