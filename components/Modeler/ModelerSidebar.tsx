"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll_area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapseable";

const sidebarItems = [
  "Start Events",
  "Activities",
  "Structural",
  "Gateways",
  "Boundary Events",
  "Intermediate Catching Events",
  "Intermediate Throwing Events",
  "End Events",
  "Swimlanes",
];

export default function ModelerSidebar() {
  const [openItems, setOpenItems] = useState<string[]>(["Start Events"]);

  const toggleItem = (item: string) => {
    setOpenItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sidebarItems.map((item) => (
            <Collapsible
              key={item}
              open={openItems.includes(item)}
              onOpenChange={() => toggleItem(item)}
            >
              <CollapsibleTrigger className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                {openItems.includes(item) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                {item}
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-6 mt-1 space-y-1">
                {/* Placeholder for actual BPMN elements */}
                <div className="px-2 py-1 text-sm text-slate-500">
                  Elements...
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>

      {/* Process Navigator */}
      <div className="border-t border-slate-200">
        <div className="bg-blue-600 text-white px-3 py-2 text-sm font-semibold">
          Process Navigator
        </div>
        <div className="p-2">
          <div className="px-2 py-1.5 text-sm bg-white border border-green-500 rounded-md text-slate-700">
            Process: testing somewhere
          </div>
          <div className="mt-2 px-2 text-xs text-slate-500">
            No structural elements used.
          </div>
        </div>
      </div>
    </div>
  );
}