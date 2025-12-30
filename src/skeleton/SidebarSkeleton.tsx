import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SidebarSkeleton: React.FC = () => {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50/50">
      <div className="border-b bg-white p-4">
        <h2 className="text-lg font-bold text-gray-900">Orbit Drive</h2>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-3.5 w-3.5 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-4 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-24 bg-slate-200" />
        </div>

        <div className="ml-4 flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-3.5 w-3.5 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-4 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-28 bg-slate-200" />
        </div>

        <div className="ml-8 flex items-center gap-2 px-2 py-1.5">
          <div className="w-3.5" />
          <Skeleton className="h-4 w-4 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-20 bg-slate-200" />
        </div>

        <div className="ml-8 flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-3.5 w-3.5 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-4 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-16 bg-slate-200" />
        </div>

        <div className="ml-12 flex items-center gap-2 px-2 py-1.5">
          <div className="w-3.5" />
          <Skeleton className="h-4 w-4 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-14 bg-slate-200" />
        </div>

        <div className="ml-4 flex items-center gap-2 px-2 py-1.5">
          <div className="w-3.5" />
          <Skeleton className="h-4 w-4 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-24 bg-slate-200" />
        </div>

        <div className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-3.5 w-3.5 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-4 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-32 bg-slate-200" />
        </div>

        <div className="ml-4 flex items-center gap-2 px-2 py-1.5">
          <div className="w-3.5" />
          <Skeleton className="h-4 w-4 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-20 bg-slate-200" />
        </div>

        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-3.5" />
          <Skeleton className="h-4 w-4 shrink-0 bg-slate-200" />
          <Skeleton className="h-4 w-28 bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
