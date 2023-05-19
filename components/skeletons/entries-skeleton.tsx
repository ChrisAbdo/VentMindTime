import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EntriesSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <li key={i}>
          <div className="px-4 border border-[#333] hover:bg-[#111] transition-all duration-200 rounded-md relative flex justify-between items-center gap-x-6 py-2">
            <div className="flex flex-col gap-x-4">
              <div className="min-w-0 flex-auto">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </>
  );
}
