import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { issueMetadata } from "@/enums/ticket/IssueMetadata";
import { Priority } from "@/enums/ticket/Priority";
import { Status } from "@/enums/ticket/Status";
import type { Ticket } from "@/models/Ticket";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { IconFile } from "@tabler/icons-react";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const formatDateWithSuffix = (date: Date) => {
    const day = date.getDate();
    const suffix =
        day === 1 || day === 21 || day === 31
            ? "st"
            : day === 2 || day === 22
                ? "nd"
                : day === 3 || day === 23
                    ? "rd"
                    : "th";

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

export function TicketDialogSkeleton({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    return (


        <Card>
            <CardContent>
                <div className="md:max-w-7xl w-full mx-auto space-y-4">
                    {/* Ticket ID + System ID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="flex flex-col">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 mt-1 w-full" />
                        </div>
                        <div className="flex flex-col">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 mt-1 w-full" />
                        </div>
                    </div>

                    {/* Created By + Created At */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="flex flex-col">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 mt-1 w-full" />
                        </div>
                        <div className="flex flex-col">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 mt-1 w-full" />
                        </div>
                    </div>

                    {/* Priority + Status */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-16 mt-1 sm:mt-0" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-20 mt-1 sm:mt-0" />
                        </div>
                    </div>

                    {/* Issues Grid Placeholder */}
                    <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-full h-24 p-4 rounded-md border border-input/50 bg-transparent shadow-none flex flex-col gap-2"
                                >
                                    <Skeleton className="h-4 w-28" />
                                    <div className="flex gap-2 flex-wrap pt-1">
                                        {[...Array(2)].map((_, j) => (
                                            <Skeleton key={j} className="h-5 w-20 rounded-md" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Issue Description */}
                    <div className="pt-2">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-20 w-full" />
                    </div>

                    {/* Surgeon Comment */}
                    <div className="pt-2">
                        <Skeleton className="h-4 w-36 mb-1" />
                        <Skeleton className="h-20 w-full" />
                    </div>

                    {/* Comments */}
                    <div className="pt-2">
                        <Skeleton className="h-4 w-28 mb-1" />
                        <Skeleton className="h-20 w-full" />
                    </div>

                    {/* Attachments */}
                    <div className="pt-2">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <div className="flex flex-wrap gap-2 mt-1">
                            {[...Array(2)].map((_, i) => (
                                <Skeleton key={i} className="h-8 w-28 rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="w-full flex justify-center pt-4">
                        <Skeleton className="h-10 w-full md:max-w-xs rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>

    );
}

type TicketDialogProps = {
    ticket?: Ticket;
    open: boolean;
    loading: boolean;
    onOpenChange: (open: boolean) => void;
};

export function TicketDialog({ ticket, open, loading, onOpenChange }: TicketDialogProps) {
    const [comment, setComment] = useState(ticket?.comments || "");

    useEffect(() => {
        if (open) {
            setComment(ticket?.comments || "");
        }
    }, [ticket, open]);

    const handleSave = () => {
        console.log("Saved comment:", comment);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:max-w-5xl xl:max-w-7xl w-full mx-auto flex flex-col gap-y-4 max-h-screen overflow-y-auto">

                <DialogHeader className="text-left">
                    <DialogTitle>Ticket Details</DialogTitle>
                    <DialogDescription>
                        Here are more details about the ticket.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <TicketDialogSkeleton open={open} onOpenChange={onOpenChange} />
                ) : (
                    <>

                        <Card>
                            <CardContent>
                                <div className="md:max-w-7xl w-full mx-auto space-y-4">
                                    {/* Ticket ID + System ID */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                        {/* Ticket ID */}
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">Ticket ID</div>
                                            <Input value={ticket?.ticketId} disabled className="w-full mt-1 text-sm" />
                                        </div>

                                        {/* System ID */}
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">System ID</div>
                                            <Input value={ticket?.systemId} disabled className="w-full mt-1 text-sm" />
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                        {/* Created By */}
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">Created By</div>
                                            <Input value={ticket?.createdBy} disabled className="w-full mt-1 text-sm" />
                                        </div>

                                        {/* Created At */}
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">Created At</div>
                                            <Input
                                                value={
                                                    ticket?.ticketCreationDate
                                                        ? formatDateWithSuffix(ticket!.ticketCreationDate)
                                                        : ""
                                                }
                                                disabled
                                                className="w-full mt-1 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid grid-cols-2 gap-x-6 gap-y-4">
                                        {/* Priority */}
                                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                            <div className="text-sm font-medium">Priority</div>
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "capitalize text-xs px-2 py-1 rounded-lg w-fit mt-1",
                                                    ticket?.priority === Priority.HIGH
                                                        ? "bg-red-100 text-red-600"
                                                        : ticket?.priority === Priority.MEDIUM
                                                            ? "bg-yellow-100 text-yellow-600"
                                                            : "bg-green-100 text-green-600"
                                                )}
                                            >
                                                {ticket?.priority}
                                            </Badge>
                                        </div>
                                        {/* Status */}
                                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                            <div className="text-sm font-medium">Status</div>
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "capitalize text-xs px-2 py-1 rounded-lg w-fit mt-1",
                                                    ticket?.status === Status.OPEN
                                                        ? "bg-blue-100 text-blue-600"
                                                        : ticket?.status === Status.IN_PROGRESS
                                                            ? "bg-orange-100 text-orange-600"
                                                            : ticket?.status === Status.UNDER_VERIFICATION
                                                                ? "bg-pink-100 text-pink-600"
                                                                : ticket?.status === Status.SOLVED
                                                                    ? "bg-green-100 text-green-600"
                                                                    : ""
                                                )}
                                            >
                                                {ticket?.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    {/* Issues */}
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">Issues</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {ticket?.issues ? (
                                                Object.entries(ticket.issues).map(([category, subkeys]) => (
                                                    <Card className="w-full h-fit p-4 col-span-1 mt-1 rounded-md border outline-0 border-input/50 bg-transparent shadow-none" key={category}>
                                                        <div>
                                                            <div className="capitalize text-sm font-medium text-muted-foreground">
                                                                {category}
                                                            </div>
                                                            {subkeys.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 pt-2">
                                                                    {subkeys.map((subkey) => (
                                                                        <Badge
                                                                            key={subkey}
                                                                            className="px-2 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground border"
                                                                            variant="secondary"
                                                                        >
                                                                            {
                                                                                issueMetadata[
                                                                                category as keyof typeof issueMetadata
                                                                                ]?.[
                                                                                subkey as keyof (typeof issueMetadata)[keyof typeof issueMetadata]
                                                                                ] ?? subkey
                                                                            }
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Card>
                                                ))
                                            ) : (
                                                <div className="font-medium text-muted-foreground col-span-3">
                                                    None
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Issue Description */}
                                    <div className="pt-2">
                                        <span className="text-sm font-medium">Issue Description</span>
                                        <Textarea
                                            placeholder="issue description"
                                            className="resize-none mt-1"
                                            value={ticket?.issueDescription}
                                            disabled
                                        />
                                    </div>

                                    {/* Surgeon Comment */}
                                    <div className="pt-2">
                                        <span className="text-sm font-medium">Surgeon Comment</span>
                                        <Textarea
                                            placeholder="surgeon comments"
                                            className="resize-none mt-1"
                                            value={ticket?.surgeonComment}
                                            disabled
                                        />
                                    </div>

                                    {/* Comments */}
                                    <div className="pt-2">
                                        <span className="text-sm font-medium">Comments</span>
                                        <Textarea
                                            placeholder="comments"
                                            className="resize-none mt-1"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </div>

                                    {/* Attachments */}
                                    <div>
                                        <div className="text-sm font-medium">Attachments</div>
                                        {ticket?.attachments?.length ? (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {ticket.attachments.map((file, index) => (
                                                    <span
                                                        key={index}
                                                        className="flex items-center gap-1 border rounded-md px-3 py-1 text-sm bg-muted text-muted-foreground cursor-pointer"
                                                    >
                                                        <IconFile className="w-4 h-4" />
                                                        {file.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="font-medium text-muted-foreground">None</div>
                                        )}
                                    </div>

                                    {/* Save Button */}
                                    <div className="w-full flex justify-center">
                                        <Button className="w-full md:max-w-xs cursor-pointer" onClick={handleSave}>Save</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
