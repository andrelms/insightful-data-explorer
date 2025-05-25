
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function ConvencaoSkeleton() {
  return (
    <Card>
      <CardContent className="py-8">
        <div className="flex justify-center">
          <div className="animate-pulse space-y-6 w-full max-w-3xl">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
            <div className="h-32 bg-muted rounded w-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
