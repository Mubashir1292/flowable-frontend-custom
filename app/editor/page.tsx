"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, Upload, Loader2 } from "lucide-react";

// Import types (we will create a dummy type file later if TS complains)
// @ts-ignore
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from "bpmn-js-properties-panel";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();       
  const modelId = searchParams.get("id");
  const isNew = searchParams.get("new");
  type BpmnModelerInstance = InstanceType<typeof BpmnModeler>;

  const canvasRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModelerInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [modelName, setModelName] = useState("New Process");

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Initialize the BPMN Modeler
    const modeler = new BpmnModeler({
      container: canvasRef.current,
      propertiesPanel: {
        parent: "#properties-panel",
      },
      // additionalModules: [
      //   BpmnPropertiesPanelModule,
      //   BpmnPropertiesProviderModule,
      // ],
    });

    modelerRef.current = modeler;

    // 2. Load or Create Diagram
    const initDiagram = async () => {
      try {
        if (modelId && !isNew) {
          // TODO: Fetch XML from backend here later
          // const xml = await fetchModelXml(modelId);
          // await modeler.importXML(xml);

          // For now, just create a new blank diagram
          await modeler.createDiagram();
          setModelName("Existing Process (Mock)");
        } else {
          await modeler.createDiagram();
        }

        // Zoom to fit
        const canvas = modeler.get("canvas");
        canvas.zoom("fit-viewport");
      } catch (err) {
        console.error("Error initializing diagram:", err);
      } finally {
        setLoading(false);
      }
    };

    initDiagram();

    // Cleanup on unmount
    return () => {
      modeler.destroy();
    };
  }, [modelId, isNew]);

  const handleSave = async () => {
    if (!modelerRef.current) return;
    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      console.log("Saved XML:", xml);
      // TODO: Send XML to backend here later
      alert("Model saved! Check console for XML.");
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  const handleDownload = async () => {
    if (!modelerRef.current) return;
    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${modelName.replace(/\s+/g, "_")}.bpmn`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Editor Toolbar */}
      <div className="h-12 bg-slate-100 border-b border-slate-300 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-lg font-semibold text-slate-800">{modelName}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      {/* Editor Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* BPMN Canvas (bpmn-js will automatically render its palette on the left) */}
        <div className="flex-1 relative bg-gray-50">
          <div ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Properties Panel (bpmn-js will render the properties UI inside this div) */}
        <div
          id="properties-panel"
          className="w-80 border-l border-slate-200 bg-white overflow-y-auto shrink-0"
        />
      </div>
    </div>
  );
}
