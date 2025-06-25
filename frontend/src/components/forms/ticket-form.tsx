import { Button } from "@/components/ui/button";
import {
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
} from "@/components/ui/file-upload";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { issueMetadata, issueMetdataMap } from "@/enums/ticket/IssueMetadata";
import { Priority } from "@/enums/ticket/Priority";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, Paperclip } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import type { IssueMap } from "@/enums/ticket/Issue";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { useAuth } from "@/context/AuthContext";
import type { Ticket } from "@/models/Ticket";
import { Status } from "@/enums/ticket/Status";
import { createTicket } from "@/api/ticket/ticket-api";
import { omit, values } from "lodash";

const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 100,
    multiple: true,
};

const formSchema = z.object({
    systemId: z
        .string()
        .trim()
        .min(4, {
            message: "System ID must be 4 digits.",
        })
        .max(4, {
            message: "System ID must be 4 digits.",
        }),
    hospitalName: z
        .string()
        .trim()
        .min(1, {
            message: "Hospital name cannot be empty",
        })
        .max(100, {
            message: "Hospital name cannot exceed 100 characters",
        }),
    surgeonName: z
        .string()
        .trim()
        .min(1, {
            message: "Surgeon name cannot be empty",
        })
        .max(100, {
            message: "Surgeon name cannot exceed 100 characters",
        }),
    priority: z.enum(Priority, {
        message: "Priority cannot be empty",
    }),

    issuehardware: z.array(
        z.enum(
            issueMetdataMap["hardware"] as [keyof typeof issueMetadata.hardware]
        )
    ),
    issuesoftware: z.array(
        z.enum(
            issueMetdataMap["software"] as [keyof typeof issueMetadata.software]
        )
    ),
    issueother: z.array(
        z.enum(issueMetdataMap["other"] as [keyof typeof issueMetadata.other])
    ),
    // Add a hidden validation field
    issueSelection: z
        .string()
        .min(1, {
            message:
                "At least one issue from Hardware, Software, or Other must be selected.",
        })
        .optional(),
    issueDescription: z
        .string()
        .trim()
        .min(1, {
            message: "Description cannot be empty",
        })
        .max(1000, {
            message: "Description cannot exceed 1000 characters",
        }),
    surgeonComment: z
        .string()
        .max(1000, {
            message: "Surgeon's comment cannot exceed 1000 characters",
        })
        .optional(),
    attachments: z.array(z.file().max(dropZoneConfig.maxSize)).optional(),
});

export default function TicketForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { user } = useAuth();
    const [files, setFiles] = useState<File[] | undefined>(undefined);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            systemId: "",
            hospitalName: "",
            surgeonName: "",
            issueDescription: "",
            surgeonComment: "",
            issuehardware: [],
            issuesoftware: [],
            issueother: [],
            issueSelection: "",
        },
    });

    useEffect(() => {
        const hardware = form.watch("issuehardware");
        const software = form.watch("issuesoftware");
        const other = form.watch("issueother");

        const hasIssues =
            hardware.length > 0 || software.length > 0 || other.length > 0;

        // Update the hidden validation field
        form.setValue("issueSelection", hasIssues ? "valid" : "");
    }, [
        form.watch("issuehardware"),
        form.watch("issuesoftware"),
        form.watch("issueother"),
    ]);

    useEffect(() => {
        form.setValue("attachments", files);
    }, [files]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            delete values.issueSelection;
            const issues: IssueMap = {
                hardware: values.issuehardware,
                software: values.issuesoftware,
                other: values.issueother,
            };

            console.log(typeof values);
            const newValues = omit(values, [
                "issuehardware",
                "issuesoftware",
                "issueother",
            ]);
            const newTicket: Ticket = {
                createdBy: user?.employee_id!,
                issues: issues,
                status: Status.OPEN,
                ...newValues,
            };
            const response = await createTicket(newTicket);
            toast.success("Ticket has been submitted", {});
            form.reset();
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    const onInvalid = (errors: any) => {
        console.error("Validation failed:", errors);
    };

    return (
        <div className={cn("w-full flex flex-col", className)} {...props}>
            <Card className="p-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="systemId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Four digit System ID"
                                            type="number"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-12 md:gap-4">
                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="hospitalName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hospital Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Name of the hospital"
                                                    type="text"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-6">
                                <FormField
                                    control={form.control}
                                    name="surgeonName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Surgeon Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Name of the surgeon"
                                                    type="text"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 md:pt-2 ">
                            <div className="col-span-1">
                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger
                                                        className={cn(
                                                            "w-full",
                                                            fieldState.error &&
                                                                "border-destructive focus-visible:ring-destructive" // Apply error styles
                                                        )}
                                                    >
                                                        <SelectValue placeholder="Select the priority of this ticket" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {Object.values(
                                                                Priority
                                                            ).map(
                                                                (priority) => (
                                                                    <SelectItem
                                                                        key={
                                                                            priority
                                                                        }
                                                                        value={
                                                                            priority
                                                                        }
                                                                    >
                                                                        {priority
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase() +
                                                                            priority.slice(
                                                                                1
                                                                            )}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-3">
                                <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:grid-row-2 md:gap-4">
                                    {Object.entries(issueMetadata).map(
                                        ([categoryKey, subcategories]) => (
                                            <div key={categoryKey}>
                                                <FormField
                                                    control={form.control}
                                                    name={
                                                        `issue${categoryKey}` as
                                                            | "issuehardware"
                                                            | "issuesoftware"
                                                            | "issueother"
                                                    }
                                                    render={({
                                                        field,
                                                        fieldState,
                                                    }) => (
                                                        <FormItem>
                                                            <FormLabel
                                                                className={cn(
                                                                    fieldState.error ||
                                                                        ((
                                                                            form
                                                                                .formState
                                                                                .errors as any
                                                                        )
                                                                            .issueSelection &&
                                                                            form.getValues(
                                                                                "issueSelection"
                                                                            ) ==
                                                                                "")
                                                                        ? "font-medium text-destructive"
                                                                        : ""
                                                                )}
                                                            >
                                                                {categoryKey
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    categoryKey.slice(
                                                                        1
                                                                    )}{" "}
                                                                Issue
                                                            </FormLabel>
                                                            <FormControl>
                                                                <MultiSelector
                                                                    values={
                                                                        (field.value as [
                                                                            keyof typeof issueMetadata
                                                                        ]) ?? []
                                                                    } // Ensure values is always an array
                                                                    onValuesChange={
                                                                        field.onChange
                                                                    }
                                                                    loop
                                                                    valueLabelMap={
                                                                        issueMetadata[
                                                                            categoryKey as keyof typeof issueMetadata
                                                                        ]
                                                                    }
                                                                    className="max-w-xs"
                                                                >
                                                                    <MultiSelectorTrigger
                                                                        className={cn(
                                                                            // Show error styles if individual field has error OR if issueSelection has error
                                                                            fieldState.error ||
                                                                                ((
                                                                                    form
                                                                                        .formState
                                                                                        .errors as any
                                                                                )
                                                                                    .issueSelection &&
                                                                                    form.getValues(
                                                                                        "issueSelection"
                                                                                    ) ==
                                                                                        "")
                                                                                ? "border-destructive focus-visible:ring-destructive"
                                                                                : ""
                                                                        )}
                                                                    >
                                                                        <MultiSelectorInput
                                                                            placeholder={`Select ${categoryKey} issue(s) `}
                                                                        />
                                                                    </MultiSelectorTrigger>
                                                                    <MultiSelectorContent>
                                                                        <MultiSelectorList>
                                                                            {Object.entries(
                                                                                subcategories
                                                                            ).map(
                                                                                ([
                                                                                    subCategoryKey,
                                                                                    subCategoryValue,
                                                                                ]) => (
                                                                                    <MultiSelectorItem
                                                                                        key={
                                                                                            subCategoryKey
                                                                                        }
                                                                                        value={
                                                                                            subCategoryKey
                                                                                        } // Save the key
                                                                                    >
                                                                                        {
                                                                                            subCategoryValue as string
                                                                                        }{" "}
                                                                                        {/* Display the value */}
                                                                                    </MultiSelectorItem>
                                                                                )
                                                                            )}
                                                                        </MultiSelectorList>
                                                                    </MultiSelectorContent>
                                                                </MultiSelector>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )
                                    )}
                                    <div className="md:col-span-3">
                                        {form.getValues("issueSelection") ==
                                        "" ? (
                                            <div className="text-sm font-normal text-destructive -mt-4">
                                                {
                                                    (
                                                        form.formState
                                                            .errors as any
                                                    ).issueSelection?.message
                                                }
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="issueDescription"
                            render={({ field }) => (
                                <FormItem className="pt-4 md:pt-0">
                                    <FormLabel>Issue Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the issue encountered"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="surgeonComment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Surgeon Comment</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Comments by the surgeon"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="attachments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Add Attachments</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            value={files}
                                            onValueChange={setFiles}
                                            dropzoneOptions={dropZoneConfig}
                                            className="relative outline-dashed outline-1 outline-slate-500 bg-background rounded-lg p-2"
                                        >
                                            <FileInput id="fileInput">
                                                <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                    <CloudUpload className="text-gray-500 w-10 h-10" />
                                                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">
                                                            Click to upload
                                                        </span>
                                                        &nbsp; or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        SVG, PNG, JPG or GIF
                                                    </p>
                                                </div>
                                            </FileInput>
                                            <FileUploaderContent>
                                                {files &&
                                                    files.length > 0 &&
                                                    files.map((file, i) => (
                                                        <FileUploaderItem
                                                            key={i}
                                                            index={i}
                                                        >
                                                            <Paperclip className="h-4 w-4 stroke-current" />
                                                            <span>
                                                                {file.name}
                                                            </span>
                                                        </FileUploaderItem>
                                                    ))}
                                            </FileUploaderContent>
                                        </FileUploader>
                                    </FormControl>
                                    <FormDescription>
                                        Upload any images or videos.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:max-w-xs"
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
