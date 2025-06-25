import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TicketDialogSkeleton() {
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

          {/* Issues */}
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

          {/* Textareas */}
          <div className="pt-2">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="pt-2">
            <Skeleton className="h-4 w-36 mb-1" />
            <Skeleton className="h-20 w-full" />
          </div>
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