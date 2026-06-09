"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapseable"; // Fixed typo in import if needed
import { ScrollArea } from "@/components/ui/scroll_area";
import {
  ChevronRight,
  ChevronDown,
  Circle,
  Clock,
  Mail,
  Radio,
  AlertTriangle,
  FileText,
  Link,
  X,
  RotateCcw,
  Ban,
} from "lucide-react";

// ✅ FIX 1: Added eventDefinitionType to the interface
interface EventItem {
  id: string;
  label: string;
  bpmnType: string;
  eventDefinitionType?: string; // <--- ADD THIS
  icon: any;
  description: string;
}

const eventCategories: EventItem[] = [
  // Start Events
  { id: "start-none", label: "Start Event", bpmnType: "bpmn:StartEvent", icon: Circle, description: "None Start Event" },
  { id: "start-timer", label: "Timer Start", bpmnType: "bpmn:StartEvent", eventDefinitionType: "bpmn:TimerEventDefinition", icon: Clock, description: "Timer Start Event" },
  { id: "start-message", label: "Message Start", bpmnType: "bpmn:StartEvent", eventDefinitionType: "bpmn:MessageEventDefinition", icon: Mail, description: "Message Start Event" },
  { id: "start-signal", label: "Signal Start", bpmnType: "bpmn:StartEvent", eventDefinitionType: "bpmn:SignalEventDefinition", icon: Radio, description: "Signal Start Event" },
  { id: "start-error", label: "Error Start", bpmnType: "bpmn:StartEvent", eventDefinitionType: "bpmn:ErrorEventDefinition", icon: AlertTriangle, description: "Error Start Event" },

  // End Events
  { id: "end-none", label: "End Event", bpmnType: "bpmn:EndEvent", icon: Circle, description: "None End Event" },
  { id: "end-message", label: "Message End", bpmnType: "bpmn:EndEvent", eventDefinitionType: "bpmn:MessageEventDefinition", icon: Mail, description: "Message End Event" },
  { id: "end-signal", label: "Signal End", bpmnType: "bpmn:EndEvent", eventDefinitionType: "bpmn:SignalEventDefinition", icon: Radio, description: "Signal End Event" },
  { id: "end-error", label: "Error End", bpmnType: "bpmn:EndEvent", eventDefinitionType: "bpmn:ErrorEventDefinition", icon: AlertTriangle, description: "Error End Event" },
  { id: "end-terminate", label: "Terminate End", bpmnType: "bpmn:EndEvent", eventDefinitionType: "bpmn:TerminateEventDefinition", icon: X, description: "Terminate End Event" },

  // Intermediate Catching Events
  { id: "catch-timer", label: "Timer Catch", bpmnType: "bpmn:IntermediateCatchEvent", eventDefinitionType: "bpmn:TimerEventDefinition", icon: Clock, description: "Timer Intermediate Catch Event" },
  { id: "catch-message", label: "Message Catch", bpmnType: "bpmn:IntermediateCatchEvent", eventDefinitionType: "bpmn:MessageEventDefinition", icon: Mail, description: "Message Intermediate Catch Event" },
  { id: "catch-signal", label: "Signal Catch", bpmnType: "bpmn:IntermediateCatchEvent", eventDefinitionType: "bpmn:SignalEventDefinition", icon: Radio, description: "Signal Intermediate Catch Event" },

  // Intermediate Throwing Events
  { id: "throw-message", label: "Message Throw", bpmnType: "bpmn:IntermediateThrowEvent", eventDefinitionType: "bpmn:MessageEventDefinition", icon: Mail, description: "Message Intermediate Throw Event" },
  { id: "throw-signal", label: "Signal Throw", bpmnType: "bpmn:IntermediateThrowEvent", eventDefinitionType: "bpmn:SignalEventDefinition", icon: Radio, description: "Signal Intermediate Throw Event" },
];

interface EventPaletteProps {
  onEventDragStart?: (event: React.DragEvent, data: EventItem) => void;
}

export default function EventPalette({ onEventDragStart }: EventPaletteProps) {
  const [openSections, setOpenSections] = useState<string[]>(["Start Events"]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleDragStart = (e: React.DragEvent, item: EventItem) => {
    // ✅ Send specific keys instead of a JSON string
    e.dataTransfer.setData("application/bpmn-type", item.bpmnType);
    e.dataTransfer.setData("application/bpmn-label", item.label);
    
    // ✅ Send the event definition type if it exists (e.g., Timer, Message)
    if (item.eventDefinitionType) {
      e.dataTransfer.setData("application/bpmn-event-def-type", item.eventDefinitionType);
    }
    
    e.dataTransfer.effectAllowed = "copy";
    
    if (onEventDragStart) {
      onEventDragStart(e, item);
    }
  };

  const renderEventItem = (item: EventItem) => {
    const Icon = item.icon;
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md cursor-move transition-colors group"
        title={item.description}
      >
        <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
        <span className="truncate">{item.label}</span>
      </div>
    );
  };

  const groupEventsByCategory = () => {
    const groups: Record<string, EventItem[]> = {
      "Start Events": eventCategories.filter((e) => e.bpmnType === "bpmn:StartEvent"),
      "End Events": eventCategories.filter((e) => e.bpmnType === "bpmn:EndEvent"),
      "Intermediate Catching": eventCategories.filter((e) => e.bpmnType === "bpmn:IntermediateCatchEvent"),
      "Intermediate Throwing": eventCategories.filter((e) => e.bpmnType === "bpmn:IntermediateThrowEvent"),
    };
    return groups;
  };

  const groups = groupEventsByCategory();

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {Object.entries(groups).map(([category, items]) => (
          <Collapsible
            key={category}
            open={openSections.includes(category)}
            onOpenChange={() => toggleSection(category)}
          >
            <CollapsibleTrigger className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
              {openSections.includes(category) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {category}
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-6 mt-1 space-y-0.5">
              {items.map(renderEventItem)}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  );
}