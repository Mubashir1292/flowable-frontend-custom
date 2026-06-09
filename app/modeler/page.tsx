"use client";

import { useState } from "react";
import ModelerHeader from "@/components/Modeler/ModelerHeader";
import ModelerToolbar from "@/components/Modeler/ModelerToolbar";
import EventPalette from "@/components/Modeler/EventPalette";
import BpmnCanvas from "@/components/Modeler/ModelerCanvas";
import PropertiesPanel from "@/components/Modeler/PropertiesPanel";
import { ScrollArea } from "@/components/ui/scroll_area";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function ModelerPage() {
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [sidebarOpenSections, setSidebarOpenSections] = useState<string[]>([
    "Events",
  ]);

  const handleElementAdded = (element: any) => {
    setSelectedElement(element);
  };

  const handleEventDragStart = (event: any, data: any) => {
    console.log("Dragging event:", data);
  };

  const handlePropertyUpdate = (key: string, value: any) => {
    console.log("Property updated:", key, value);
    // Here you would update the BPMN model
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* <ModelerHeader /> */}
      <ModelerToolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-white">
            <h2 className="text-sm font-semibold text-slate-800">Palette</h2>
          </div>

          <div className="flex-1 flex flex-col">
            {/* Events Section */}
            <div className="border-b border-slate-200">
              <button
                onClick={() =>
                  setSidebarOpenSections((prev) =>
                    prev.includes("Events")
                      ? prev.filter((s) => s !== "Events")
                      : [...prev, "Events"],
                  )
                }
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {sidebarOpenSections.includes("Events") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Events
              </button>

              {sidebarOpenSections.includes("Events") && (
                <div className="h-96">
                  <EventPalette onEventDragStart={handleEventDragStart} />
                </div>
              )}
            </div>

            {/* Activities Section (Placeholder) */}
            <div className="border-b border-slate-200">
              <button
                onClick={() =>
                  setSidebarOpenSections((prev) =>
                    prev.includes("Activities")
                      ? prev.filter((s) => s !== "Activities")
                      : [...prev, "Activities"],
                  )
                }
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {sidebarOpenSections.includes("Activities") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Activities
              </button>
            </div>

            {/* Gateways Section (Placeholder) */}
            <div>
              <button
                onClick={() =>
                  setSidebarOpenSections((prev) =>
                    prev.includes("Gateways")
                      ? prev.filter((s) => s !== "Gateways")
                      : [...prev, "Gateways"],
                  )
                }
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {sidebarOpenSections.includes("Gateways") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Gateways
              </button>
            </div>
          </div>

          {/* Process Navigator */}
          <div className="border-t border-slate-200 bg-white">
            <div className="bg-blue-600 text-white px-3 py-2 text-xs font-semibold">
              Process Navigator
            </div>
            <div className="p-2">
              <div className="px-2 py-1.5 text-xs bg-white border border-green-500 rounded text-slate-700">
                Process: testing somewhere
              </div>
              <div className="mt-2 px-2 text-xs text-slate-500">
                No structural elements used.
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas */}
          <div className="flex-1 overflow-hidden">
            <BpmnCanvas onElementAdded={handleElementAdded} />
          </div>

          {/* Properties Panel */}
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateProperty={handlePropertyUpdate}
          />
        </div>
      </div>
    </div>
  );
}
