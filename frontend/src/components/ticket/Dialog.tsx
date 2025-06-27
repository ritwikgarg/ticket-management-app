import { updateTicket } from "@/api/ticket/ticket-api";
import { getUserList } from "@/api/user/user-api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { issueMetadata } from "@/enums/ticket/IssueMetadata";
import { Priority } from "@/enums/ticket/Priority";
import { Status } from "@/enums/ticket/Status";
import { Role } from "@/enums/user/Role";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/models/Ticket";
import type { User } from "@/models/User";
import { formatDateWithSuffix } from "@/utils/FormatDate";
import { IconEdit, IconFile, IconUserCircle } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "../ui/multi-select";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTriggerWithIcon,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { TicketDialogSkeleton } from "./DialogSkeleton";

type TicketDialogProps = {
    ticket?: Ticket;
    open: boolean;
    loading: boolean;
    onOpenChange: (open: boolean) => void;
    onTicketUpdate?: (ticket: Ticket) => void;
};

export function TicketDialog({
    ticket,
    open,
    loading,
    onOpenChange,
    onTicketUpdate,
}: TicketDialogProps) {
    const { user } = useAuth();
    const [comment, setComment] = useState<string[]>(ticket?.comments || []);
    const [assignedTo, setAssignedTo] = useState<User[] | undefined>(
        ticket?.assignedTo
    );
    const [status, setStatusTo] = useState<Status>(
        ticket?.status || Status.OPEN
    );
    const [userOptions, setUserOptions] = useState<User[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const oldComments = ticket?.comments;

    useEffect(() => {
        setAssignedTo(ticket?.assignedTo);
        setComment([...(ticket?.comments || []), ...comment]);
        setStatusTo(ticket?.status || Status.OPEN);
    }, [ticket?.assignedTo, ticket?.comments, ticket?.status]);

    useEffect(() => {
        if (user?.role === Role.ADMIN) {
            getUserList(Role.SOLVER).then((res) => {
                setUserOptions(res.data);
            });
        }
    }, [user]);

    function setAssignedToUsingUserOptions(employeeIds: string[]): void {
        const usersAssignedTo: User[] = userOptions.filter((user) =>
            employeeIds.includes(user.employee_id)
        );
        setAssignedTo(usersAssignedTo);
    }

    const handleSave = async () => {
        if (!ticket?.ticketId || isSaving) return;

        setIsSaving(true);
        try {
            const updatedTicket: Ticket = {
                ...ticket!,
                comments: [...(oldComments || []), ...comment],
                assignedTo: assignedTo,
                status: status,
            };
            const res = await updateTicket(updatedTicket);
            if (res.success) {
                toast.success("Changes saved successfully");
                onTicketUpdate?.(res.data);
                onOpenChange(false);
            }
        } catch (error) {
            toast.error("An error occurred while saving.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:max-w-5xl xl:max-w-6xl w-full mx-auto flex flex-col gap-y-4 max-h-screen overflow-y-auto hide-scrollbar">
                <DialogHeader className="mt-6 md:mt-0 text-left">
                    <DialogTitle>Ticket Details</DialogTitle>
                    <DialogDescription>
                        Here are more details about the ticket.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <TicketDialogSkeleton role={user?.role} />
                ) : (
                    <>
                        <Card>
                            <CardContent>
                                <div className="md:max-w-7xl w-full mx-auto space-y-4">
                                    {/* Ticket ID + System ID */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                        {/* Ticket ID */}
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">
                                                Ticket ID
                                            </div>
                                            <Input
                                                value={ticket?.ticketId}
                                                disabled
                                                className="w-full mt-1 text-sm"
                                            />
                                        </div>

                                        {/* System ID */}
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">
                                                System ID
                                            </div>
                                            <Input
                                                value={ticket?.systemId}
                                                disabled
                                                className="w-full mt-1 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                        {/* Created By */}
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">
                                                Created By
                                            </div>
                                            <Input
                                                value={ticket?.createdBy}
                                                disabled
                                                className="w-full mt-1 text-sm"
                                            />
                                        </div>

                                        {/* Created At */}
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">
                                                Created At
                                            </div>
                                            <Input
                                                value={
                                                    ticket?.ticketCreationDate
                                                        ? formatDateWithSuffix(
                                                              ticket!
                                                                  .ticketCreationDate
                                                          )
                                                        : ""
                                                }
                                                disabled
                                                className="w-full mt-1 text-sm"
                                            />
                                        </div>
                                    </div>

                                    {user?.role === Role.ADMIN ? (
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium">
                                                Assigned To
                                            </div>
                                            <MultiSelector
                                                values={
                                                    assignedTo?.map((user) => {
                                                        console.log(
                                                            user.employee_id
                                                        );
                                                        return user.employee_id;
                                                    }) ?? []
                                                }
                                                onValuesChange={(newValues) =>
                                                    setAssignedToUsingUserOptions(
                                                        newValues
                                                    )
                                                }
                                                loop
                                                valueLabelMap={userOptions.reduce(
                                                    (acc, user) => {
                                                        acc[
                                                            user.employee_id
                                                        ] = `${user.first_name} ${user.last_name}`;
                                                        return acc;
                                                    },
                                                    {} as Record<string, string>
                                                )}
                                                className="mt-1"
                                            >
                                                <MultiSelectorTrigger
                                                    icon={<IconUserCircle />}
                                                >
                                                    <MultiSelectorInput placeholder="Select assignee(s)" />
                                                </MultiSelectorTrigger>
                                                <MultiSelectorContent>
                                                    <MultiSelectorList>
                                                        {userOptions.map(
                                                            (user) => (
                                                                <MultiSelectorItem
                                                                    key={
                                                                        user.employee_id
                                                                    }
                                                                    value={
                                                                        user.employee_id
                                                                    }
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <IconUserCircle className="w-4 h-4 text-muted-foreground" />
                                                                        <span>
                                                                            {
                                                                                user.first_name
                                                                            }{" "}
                                                                            {
                                                                                user.last_name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </MultiSelectorItem>
                                                            )
                                                        )}
                                                    </MultiSelectorList>
                                                </MultiSelectorContent>
                                            </MultiSelector>
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    <div className="grid grid-cols-1 md:grid grid-cols-2 gap-x-6 gap-y-4">
                                        {/* Priority */}
                                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                            <div className="text-sm font-medium">
                                                Priority
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "capitalize text-xs px-2 py-1 rounded-lg w-fit mt-1",
                                                    ticket?.priority ===
                                                        Priority.HIGH
                                                        ? "bg-red-100 text-red-600"
                                                        : ticket?.priority ===
                                                          Priority.MED
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-green-100 text-green-600"
                                                )}
                                            >
                                                {ticket?.priority}
                                            </Badge>
                                        </div>
                                        {/* Status */}
                                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                                            <div className="text-sm font-medium">
                                                Status
                                            </div>
                                            <div className="flex flex-row items-center gap-x-2">
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "capitalize text-xs font-semibold px-2 py-1 rounded-lg w-fit mt-1",
                                                        status === Status.OPEN
                                                            ? "bg-blue-100 text-blue-600"
                                                            : status ===
                                                              Status.DOING
                                                            ? "bg-orange-100 text-orange-600"
                                                            : status ===
                                                              Status.REVIEW
                                                            ? "bg-pink-100 text-pink-600"
                                                            : status ===
                                                              Status.SOLVED
                                                            ? "bg-green-100 text-green-600"
                                                            : ""
                                                    )}
                                                >
                                                    {status}
                                                </Badge>
                                                <Select
                                                    value={status}
                                                    onValueChange={(
                                                        newValue
                                                    ) => {
                                                        setStatusTo(
                                                            newValue as Status
                                                        );
                                                    }}
                                                    // defaultValue={}
                                                >
                                                    <SelectTriggerWithIcon
                                                        className={cn(
                                                            "bg-secondary rounded-lg p-1"
                                                        )}
                                                        icon={
                                                            <IconEdit className="w-5 h-5 stroke-1" />
                                                        }
                                                    >
                                                        {/* <SelectValue placeholder="Select the status of this ticket" /> */}
                                                    </SelectTriggerWithIcon>
                                                    <SelectContent align="end">
                                                        <SelectGroup>
                                                            {Object.values(
                                                                Status
                                                            )
                                                                .filter(
                                                                    (
                                                                        status
                                                                    ) => {
                                                                        if (
                                                                            status ===
                                                                                Status.SOLVED &&
                                                                            user?.role !==
                                                                                Role.ADMIN
                                                                        ) {
                                                                            return false; // Hide 'SOLVED' if not admin
                                                                        }
                                                                        return true;
                                                                    }
                                                                )
                                                                .map(
                                                                    (
                                                                        status
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                status
                                                                            }
                                                                            value={
                                                                                status
                                                                            }
                                                                        >
                                                                            {status
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase() +
                                                                                status
                                                                                    .slice(
                                                                                        1
                                                                                    )
                                                                                    .toLowerCase()}
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Issues */}
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">
                                            Issues
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {ticket?.issues ? (
                                                Object.entries(
                                                    ticket.issues
                                                ).map(([category, subkeys]) => (
                                                    <Card
                                                        className="w-full h-fit p-4 col-span-1 mt-1 rounded-md border outline-0 border-input/50 bg-transparent shadow-none"
                                                        key={category}
                                                    >
                                                        <div>
                                                            <div className="capitalize text-sm font-medium text-muted-foreground">
                                                                {category}
                                                            </div>
                                                            {subkeys.length >
                                                                0 && (
                                                                <div className="flex flex-wrap gap-2 pt-2">
                                                                    {subkeys.map(
                                                                        (
                                                                            subkey
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    subkey
                                                                                }
                                                                                className="px-2 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground border"
                                                                                variant="secondary"
                                                                            >
                                                                                {issueMetadata[
                                                                                    category as keyof typeof issueMetadata
                                                                                ]?.[
                                                                                    subkey as keyof (typeof issueMetadata)[keyof typeof issueMetadata]
                                                                                ] ??
                                                                                    subkey}
                                                                            </Badge>
                                                                        )
                                                                    )}
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
                                        <span className="text-sm font-medium">
                                            Issue Description
                                        </span>
                                        <Textarea
                                            placeholder="issue description"
                                            className="resize-none mt-1"
                                            value={ticket?.issueDescription}
                                            disabled
                                        />
                                    </div>

                                    {/* Surgeon Comment */}
                                    <div className="pt-2">
                                        <span className="text-sm font-medium">
                                            Surgeon Comment
                                        </span>
                                        <Textarea
                                            placeholder="surgeon comments..."
                                            className="resize-none mt-1"
                                            value={ticket?.surgeonComment}
                                            disabled
                                        />
                                    </div>

                                    {/* Comments */}
                                    <div className="pt-2">
                                        <span className="text-sm font-medium">
                                            Comments
                                        </span>
                                        <Textarea
                                            placeholder="Add comments..."
                                            className="resize-none mt-1"
                                            value={comment}
                                            onChange={(e) =>
                                                setComment([e.target.value])
                                            }
                                        />
                                    </div>

                                    {/* Attachments */}
                                    <div>
                                        <div className="text-sm font-medium">
                                            Attachments
                                        </div>
                                        {ticket?.attachments?.length ? (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {ticket.attachments.map(
                                                    (file, index) => (
                                                        <span
                                                            key={index}
                                                            className="flex items-center gap-1 border rounded-md px-3 py-1 text-sm bg-muted text-muted-foreground cursor-pointer"
                                                        >
                                                            <IconFile className="w-4 h-4" />
                                                            {file.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="font-medium text-muted-foreground">
                                                None
                                            </div>
                                        )}
                                    </div>

                                    {/* Save Button */}
                                    <div className="w-full flex justify-center mt-10">
                                        <Button
                                            className="w-full md:max-w-xs cursor-pointer"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                </span>
                                            ) : (
                                                "Save"
                                            )}
                                        </Button>
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
