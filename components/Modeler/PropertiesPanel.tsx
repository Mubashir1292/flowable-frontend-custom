"use client";

import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll_area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PropertiesPanelProps {
  selectedElement: any;
  onClose?: () => void;
  onUpdateProperty?: (key: string, value: any) => void;
}

export default function PropertiesPanel({ 
  selectedElement, 
  onClose,
  onUpdateProperty 
}: PropertiesPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  // ✅ FIX 1: Initialize state with default empty strings instead of an empty object
  const [properties, setProperties] = useState<any>({
    id: "",
    name: "",
    documentation: "",
    type: "",
  });

  useEffect(() => {
    if (selectedElement) {
      setProperties({
        // ✅ FIX 2: Ensure fallback to empty string if the property is undefined
        id: selectedElement.id || "",
        name: selectedElement.businessObject?.name || "",
        documentation: selectedElement.businessObject?.documentation?.[0]?.text || "",
        type: selectedElement.type || "",
      });
    } else {
      // Reset to empty strings when no element is selected
      setProperties({
        id: "",
        name: "",
        documentation: "",
        type: "",
      });
    }
  }, [selectedElement]);

  const handlePropertyChange = (key: string, value: any) => {
    setProperties((prev: any) => ({ ...prev, [key]: value }));
    if (onUpdateProperty) {
      onUpdateProperty(key, value);
    }
  };

  if (!isOpen || !selectedElement) {
    return (
      <div className="h-12 bg-slate-50 border-t border-slate-200 flex items-center px-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          <span className="font-semibold">Properties</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-64 bg-white border-t border-slate-200 flex flex-col">
      <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-600 hover:text-slate-900"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-semibold text-slate-700">
            {properties.name || selectedElement.type}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* ID */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-600">ID</Label>
            <Input
              type="text"
              // ✅ FIX 3: Always provide a fallback empty string to the value prop
              value={properties.id || ""} 
              disabled
              className="text-sm bg-slate-50"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-600">Name</Label>
            <Input
              type="text"
              value={properties.name || ""} // ✅ Fallback to empty string
              onChange={(e) => handlePropertyChange('name', e.target.value)}
              className="text-sm"
              placeholder="Enter event name"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-600">Type</Label>
            <Input
              type="text"
              value={properties.type || ""} // ✅ Fallback to empty string
              disabled
              className="text-sm bg-slate-50"
            />
          </div>

          {/* Documentation */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-600">Documentation</Label>
            <textarea
              value={properties.documentation || ""} // ✅ Fallback to empty string
              onChange={(e) => handlePropertyChange('documentation', e.target.value)}
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter documentation..."
            />
          </div>

          {/* Event-specific properties */}
          {selectedElement.businessObject?.eventDefinitions?.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-600">Event Definition</Label>
              <div className="p-3 bg-slate-50 rounded-md text-sm">
                <div className="font-medium text-slate-700">
                  {selectedElement.businessObject.eventDefinitions[0].$type.replace('bpmn:', '')}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}