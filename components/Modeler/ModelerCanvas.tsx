"use client";

import { useEffect, useRef, useState } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";

// Import bpmn-js styles
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

interface BpmnCanvasProps {
  onElementAdded?: (element: any) => void;
  onConnectionCreated?: (connection: any) => void;
}

export default function BpmnCanvas({
  onElementAdded,
  onConnectionCreated,
}: BpmnCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ✅ 1. Removed keyboard.bindTo (implicit in new versions)
    const modeler = new BpmnModeler({
      container: canvasRef.current,
    });

    modelerRef.current = modeler;

    modeler.on("connection.create", (event: any) => {
      if (onConnectionCreated) {
        onConnectionCreated(event.context);
      }
    });

    createNewDiagram();
    setupDragAndDrop();

    return () => {
      modeler.destroy();
    };
  }, []);

  const createNewDiagram = async () => {
    if (!modelerRef.current) return;
    try {
      await modelerRef.current.createDiagram();
      const canvas = modelerRef.current.get("canvas") as any;
      canvas.zoom("fit-viewport");
    } catch (err) {
      console.error("Error creating diagram:", err);
    }
  };

  const setupDragAndDrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
      setIsDragging(true);
    });

    canvas.addEventListener("dragleave", () => {
      setIsDragging(false);
    });

    canvas.addEventListener("drop", async (e) => {
      e.preventDefault();
      setIsDragging(false);

      if (!modelerRef.current) return;

      const bpmnType = e.dataTransfer?.getData("application/bpmn-type");
      const label = e.dataTransfer?.getData("application/bpmn-label");
      const eventDefinitionType = e.dataTransfer?.getData(
        "application/bpmn-event-def-type",
      );

      if (!bpmnType) return;

      try {
        const modeling = modelerRef.current.get("modeling") as any;
        const canvasModule = modelerRef.current.get("canvas") as any;

        // Calculate drop position accounting for zoom/pan
        const rect = canvas.getBoundingClientRect();
        const zoom = canvasModule.zoom();
        const viewbox = canvasModule.viewbox();
        const x = (e.clientX - rect.left) / zoom + viewbox.x;
        const y = (e.clientY - rect.top) / zoom + viewbox.y;

        // ✅ FIX 1: Create the shape NORMALLY using ONLY the type.
        // Do NOT pass a pre-created businessObject here!
        const shape = modeling.createShape(
          { type: bpmnType },
          { x, y },
          canvasModule.getRootElement(),
        );

        // ✅ FIX 2: If it's a specific event (Timer, Signal, etc.),
        // update the moddle properties AFTER the shape is created.
        if (eventDefinitionType) {
          const moddle = modelerRef.current.get("moddle") as any;
          const eventDefinition = moddle.create(eventDefinitionType);

          // This is the official API to update internal BPMN XML properties
          modeling.updateModdleProperties(shape, shape.businessObject, {
            eventDefinitions: [eventDefinition],
          });
        }

        // Set the label/name
        if (label) {
          modeling.updateProperties(shape, { name: label });
        }

        // Select the new shape
        const selection = modelerRef.current.get("selection") as any;
        selection.select(shape);

        if (onElementAdded) {
          onElementAdded(shape);
        }
      } catch (err) {
        console.error("Error creating element:", err);
      }
    });
  };
  return (
    <div
      ref={canvasRef}
      className={`w-full h-full transition-colors duration-200 ${
        isDragging ? "bg-blue-50" : "bg-white"
      }`}
    />
  );
}
