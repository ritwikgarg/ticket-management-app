import { getTicketDetails } from "@/api/ticket/ticket-api";
import { Card, CardContent } from "@/components/ui/card";
import type { IssueMap } from "@/enums/ticket/Issue";
import { Priority } from "@/enums/ticket/Priority";
import { Status } from "@/enums/ticket/Status";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/models/Ticket";
import { formatEnumValue } from "@/utils/FormatEnum";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import {
  IconBuildingHospital,
  IconClockHour4,
  IconTicket,
  IconTool,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Handle } from "../dnd/Item";
import { Badge } from "../ui/badge";
import { TicketDialog } from "./Dialog";
import { formatDateWithSuffix } from "@/utils/FormatDate";
import type { NavLinkProps } from "react-router-dom";



export type TicketCardProps = {
    ticketId?: string;
    hospitalName?: string;
    systemId?: string;
    ticketCreationDate?: Date;
    priority?: Priority;
    status?: Status;
    createdBy?: string;
    issues?: IssueMap;
    handle: boolean;
    handleProps?: any;
    handleSize?: number;
    disabled?: boolean;
    listeners?: DraggableSyntheticListeners;
};

export function TicketCard(props: TicketCardProps) {
    const {
        ticketId,
        hospitalName,
        systemId,
        ticketCreationDate,
        priority,
        createdBy,
        issues,
        handle,
        handleProps,
        listeners,
        handleSize,
        disabled
    } = props;
    const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setTicket(undefined); // Optional: clear previous data
        setLoading(true); // Step 1: set loading
        setOpen(true); // Step 2: open dialog
    };

    useEffect(() => {
        const fetchTicket = async () => {
            if (open && loading && ticketId) {
                const fetchedTicket = (await getTicketDetails(ticketId)).data;
                setTicket(fetchedTicket);
                setLoading(false);
            }
        };
        fetchTicket();
    }, [open, loading, ticketId]);

    return (
        <>

       
            <Card
                onClick={handleClick}
                className="w-full cursor-pointer hover:shadow-md transition-shadow py-0"
            >
                <CardContent className="px-0 pl-6 pr-4 py-4 flex flex-row justify-between gap-x-2">
                    {/* Ticket ID with Icon and Status */}
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IconTicket className="w-6 h-6" />
                                <h3 className="text-xl font-semibold">
                                    #{ticketId}
                                </h3>
                            </div>
                         
                        </div>

                        <div className="grid grid-cols-[auto_1fr] gap-y-3 gap-x-4 text-sm">
                            {/* Hospital Name */}
                            <div className="flex items-center gap-1 font-medium">
                                <IconBuildingHospital
                                    className="w-5 h-5"
                                    stroke={2}
                                />
                            </div>
                            <div className="text-muted-foreground">
                                {hospitalName}
                            </div>

                            {/* System ID */}
                            <div className="flex items-center gap-1 font-medium">
                                <IconTool className="w-5 h-5" stroke={2} />
                            </div>
                            <div className="text-muted-foreground">
                                {systemId}
                            </div>

                            {/* Created At */}
                            <div className="flex items-center gap-1 font-medium">
                                <IconClockHour4
                                    className="w-5 h-5"
                                    stroke={2}
                                />
                            </div>
                            <div className="text-muted-foreground">
                                {ticketCreationDate &&
                                    formatDateWithSuffix(ticketCreationDate)}
                            </div>

                            {/* Created By */}
                            <div className="flex items-center gap-1 font-medium">
                                <IconUserCircle
                                    className="w-5 h-5"
                                    stroke={2}
                                />
                            </div>
                            <div className="text-muted-foreground">
                                {createdBy || "Unknown"}
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-border"></div>

                        {/* Priority and Issues side-by-side */}
                        <div className="flex justify-between gap-6 items-center text-sm">
                            {/* Priority */}
                            <div className="flex items-center gap-2">
                                <span className="font-medium whitespace-nowrap">
                                    Priority:
                                </span>
                                <Badge
                                    className={`font-medium px-2 py-1 rounded-lg ${
                                        priority === Priority.HIGH
                                            ? "bg-red-100 text-red-600"
                                            : priority === Priority.MED
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-green-100 text-green-600"
                                    }`}
                                >
                                    {priority
                                        ?.charAt(0)
                                        .toUpperCase()
                                        .concat(priority?.slice(1))}
                                </Badge>
                            </div>

                            {/* Issues */}
                            <div className="flex items-center gap-2">
                                <span className="font-medium whitespace-nowrap">
                                    Issues:
                                </span>
                                <Badge className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground border">
                                    {Object.values(issues || {}).reduce(
                                        (total, keys) => total + keys.length,
                                        0
                                    )}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <span className="flex items-center">
                        {handle ? (
                            <Handle size={handleSize} disabled={disabled} {...handleProps} {...listeners} />
                        ) : null}
                    </span>
                </CardContent>
    
            </Card>

            {/* Show dialog only if ticket is fetched */}
            {
                <TicketDialog
                    ticket={ticket}
                    open={open}
                    loading={loading}
                    onOpenChange={setOpen}
                />
            }
        </>
    );
}

