import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function HistoryLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
