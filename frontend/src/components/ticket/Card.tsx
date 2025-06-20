import { getTicketDetails } from "@/api/ticket/ticket-api";
import { Card, CardContent } from "@/components/ui/card";
import { Priority } from "@/enums/ticket/Priority";
import type { Ticket } from "@/models/Ticket";
import { useEffect, useState } from "react";
import { TicketDialog } from "./Dialog";
import { Badge } from "../ui/badge";
import { IconTicket, IconBuildingHospital, IconTool, IconClockHour4, IconUserCircle } from '@tabler/icons-react';
import { Status } from "@/enums/ticket/Status";
import { cn } from "@/lib/utils";
import type { IssueMap } from "@/enums/ticket/Issue";

const formatDateWithSuffix = (date: Date) => {
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31 ? "st" :
      day === 2 || day === 22 ? "nd" :
        day === 3 || day === 23 ? "rd" : "th";

  let time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (time.endsWith("am")) {
    time = time.slice(0, -2) + "AM";
  } else if (time.endsWith("pm")) {
    time = time.slice(0, -2) + "PM";
  }

  const monthYear = date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return `${time}, ${day}${suffix} ${monthYear}`;
};

export type TicketCardProps = {
  ticketId?: string;
  hospitalName?: string;
  systemId?: string;
  ticketCreationDate?: Date;
  priority?: Priority;
  status?: Status;
  createdBy?: string;
  issues?: IssueMap;
};
export function TicketCard(props: TicketCardProps) {
  const { ticketId, hospitalName, systemId, ticketCreationDate, priority, createdBy, issues } = props;
  const [ticket, setTicket] = useState<Ticket | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setTicket(undefined);       // Optional: clear previous data
    setLoading(true);      // Step 1: set loading
    setOpen(true);         // Step 2: open dialog
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
        className="w-auto max-w-md cursor-pointer hover:shadow-md transition-shadow py-0"
      >
        <CardContent className="px-6 py-4 space-y-4">
          {/* Ticket ID with Icon and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconTicket className="w-6 h-6" />
              <h3 className="text-xl font-semibold">#{ticketId}</h3>
            </div>
            {props.status ? (
              <Badge
                className={cn(
                  "capitalize text-xs px-2 py-1 rounded-lg w-fit",
                  props.status === Status.OPEN
                    ? "bg-blue-100 text-blue-600"
                    : props.status === Status.IN_PROGRESS
                      ? "bg-orange-100 text-orange-600"
                      : props.status === Status.UNDER_VERIFICATION
                        ? "bg-pink-100 text-pink-600"
                        : props.status === Status.SOLVED
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600" // fallback styling
                )}
              >
                {props.status}
              </Badge>
            ) : (
              // Temporary debug - remove this once status is working
              <Badge className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg">
                No Status
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-y-3 gap-x-4 text-sm">
            {/* Hospital Name */}
            <div className="flex items-center gap-1 font-medium">
              <IconBuildingHospital className="w-5 h-5" stroke={2} />
            </div>
            <div className="text-muted-foreground">{hospitalName}</div>

            {/* System ID */}
            <div className="flex items-center gap-1 font-medium">
              <IconTool className="w-5 h-5" stroke={2} />
            </div>
            <div className="text-muted-foreground">{systemId}</div>

            {/* Created At */}
            <div className="flex items-center gap-1 font-medium">
              <IconClockHour4 className="w-5 h-5" stroke={2} />
            </div>
            <div className="text-muted-foreground">
              {ticketCreationDate && formatDateWithSuffix(ticketCreationDate)}
            </div>

            {/* Created By */}
            <div className="flex items-center gap-1 font-medium">
              <IconUserCircle className="w-5 h-5" stroke={2} />
            </div>
            <div className="text-muted-foreground">{createdBy || "Unknown"}</div>
          </div>

          {/* Separator */}
          <div className="border-t border-border"></div>

          {/* Priority and Issues side-by-side */}
          <div className="flex justify-between gap-6 items-center text-sm flex-wrap">
            {/* Priority */}
            <div className="flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">Priority:</span>
              <Badge
                className={`font-medium px-2 py-1 rounded-lg ${priority === Priority.HIGH
                  ? "bg-red-100 text-red-600"
                  : priority === Priority.MEDIUM
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                  }`}
              >
                {priority?.charAt(0).toUpperCase().concat(priority?.slice(1))}
              </Badge>
            </div>

            {/* Issues */}
            <div className="flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">Issues:</span>
              <Badge className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground border">
                {Object.values(issues || {}).reduce((total, keys) => total + keys.length, 0)}
              </Badge>
            </div>
          </div>


        </CardContent>
      </Card>

      {/* Show dialog only if ticket is fetched */}
      {(
        <TicketDialog ticket={ticket} open={open} loading={loading} onOpenChange={setOpen} />
      )}
    </>
  );
}