"use client";

import { Button } from "@/components/ui/button";
import {
  Save,
  Check,
  Scissors,
  Copy,
  ClipboardPaste,
  Trash2,
  RotateCcw,
  RotateCw,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize,
  ImageDown,
  GitBranch,
  Share2,
  HelpCircle,
  X,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export default function ModelerToolbar() {
  const [connectionMode, setConnectionMode] = useState(false);

  return (
    <div className="h-12 bg-slate-100 border-b border-slate-300 flex items-center px-2 gap-1">
      {/* Save & Validate */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Save">
        <Save className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Validate">
        <Check className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Cut, Copy, Paste */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Cut">
        <Scissors className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Copy">
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Paste">
        <ClipboardPaste className="h-4 w-4" />
      </Button>

      {/* Delete */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Delete">
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button
        variant={connectionMode ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => setConnectionMode(!connectionMode)}
        title="Create Sequence Flow"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Undo, Redo */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Undo">
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Redo">
        <RotateCw className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Print, Align */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Print">
        <Printer className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Align">
        <Maximize className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Zoom controls */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Zoom In">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Zoom Out">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Zoom Fit">
        <Maximize className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Export, Share */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Export">
        <ImageDown className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Share">
        <Share2 className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Help */}
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Help">
        <HelpCircle className="h-4 w-4" />
      </Button>

      <div className="flex-1" />

      {/* Close */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
