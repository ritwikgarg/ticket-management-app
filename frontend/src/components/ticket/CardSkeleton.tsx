import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TicketCardSkeleton() {
  return (
    <Card className="w-full cursor-pointer hover:shadow-md transition-shadow py-0">
      <CardContent className="px-0 pl-6 pr-4 py-5 flex flex-row justify-between gap-x-2">
        <div className="w-full space-y-4">
          {/* Ticket ID and Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          {/* Grid Info Section */}
          <div className="grid grid-cols-[auto_1fr] gap-y-3 gap-x-4 text-sm">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="contents">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="border-t border-border"></div>

          {/* Priority & Issues Section */}
          <div className="flex justify-between gap-6 items-center text-sm">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-5 w-10 rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Optional Handle */}
        <div className="flex items-center">
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
