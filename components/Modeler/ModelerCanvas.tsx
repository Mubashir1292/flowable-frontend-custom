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
  onElementRemoved?: (element: any) => void;
}

export default function BpmnCanvas({
  onElementAdded,
  onConnectionCreated,
  onElementRemoved,
}: BpmnCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const modeler = new BpmnModeler({
      container: canvasRef.current,
      keyboard: { bindTo: document },
    });

    modelerRef.current = modeler;

    // Listen to connection creation
    modeler.on("connection.create", (event: any) => {
      if (onConnectionCreated) {
        onConnectionCreated(event.context);
      }
    });

    // Listen to element removal
    modeler.on("elements.changed", (event: any) => {
      if (event.removed && onElementRemoved) {
        event.removed.forEach((el: any) => onElementRemoved(el));
      }
    });

    // Initialize diagram and setup drag-drop
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

  const applyTaskProperties = (
    shape: any,
    taskType: string,
    properties: any,
    modeling: any
  ) => {
    if (!properties) return;

    try {
      const moddle = modelerRef.current?.get("moddle") as any;

      switch (taskType) {
        case "userTask":
          // Set assignee, candidate users/groups
          if (properties.assignee || properties.candidateUsers?.length) {
            modeling.updateModdleProperties(shape, shape.businessObject, {
              assignee: properties.assignee,
              priority: properties.priority || 50,
            });
          }
          break;

        case "serviceTask":
          // Set implementation type
          modeling.updateProperties(shape, {
            type: "bpmn:ServiceTask",
            implementation: properties.implementation || "##Service",
          });
          break;

        case "camelTask":
          // Camel-specific properties
          modeling.updateModdleProperties(shape, shape.businessObject, {
            type: "camel",
            serviceImplementation: "org.apache.camel.flowable.CamelBehaviour",
            camelContext: properties.camelContext || "",
          });
          break;

        case "httpTask":
          // HTTP-specific properties
          modeling.updateModdleProperties(shape, shape.businessObject, {
            type: "http",
            httpMethod: properties.requestMethod || "GET",
            httpUrl: properties.requestUrl || "",
            httpHeaders: properties.requestHeaders || {},
          });
          break;

        case "muleTask":
          // Mule-specific properties
          modeling.updateModdleProperties(shape, shape.businessObject, {
            type: "mule",
            muleEndpointUrl: properties.endpointUrl || "",
            muleTransformer: properties.muleTransformer || "",
          });
          break;

        case "mailTask":
          // Mail-specific properties
          modeling.updateModdleProperties(shape, shape.businessObject, {
            type: "mail",
            mailTo: properties.to || "",
            mailFrom: properties.from || "",
            mailSubject: properties.subject || "",
            mailHtml: properties.html || "",
            mailText: properties.text || "",
            mailCc: properties.cc || "",
            mailBcc: properties.bcc || "",
          });
          break;

        case "scriptTask":
          // Script-specific properties
          modeling.updateModdleProperties(shape, shape.businessObject, {
            scriptFormat: properties.scriptFormat || "JavaScript",
            script: properties.script || "",
            resultVariable: properties.resultVariable || "",
            autoStoreVariables: properties.autoStoreVariables || true,
          });
          break;

        case "businessRuleTask":
        case "decisionTask":
          // Decision table properties
          modeling.updateModdleProperties(shape, shape.businessObject, {
            decisionRef: properties.decisionRef || properties.decisionTableKey || "",
            resultVariable: properties.resultVariable || "result",
            mapDecisionResult: properties.mapDecisionResult || "resultList",
          });
          break;

        case "receiveTask":
          // Message correlation properties
          modeling.updateModdleProperties(shape, shape.businessObject, {
            messageRef: properties.messageRef || "",
            messageQueueName: properties.messageQueueName || "",
            correlationKey: properties.correlationKey || "",
          });
          break;

        case "manualTask":
          // Manual task documentation
          if (properties.documentation) {
            modeling.updateProperties(shape, {
              documentation: properties.documentation,
            });
          }
          break;

        default:
          break;
      }

      console.log(`✅ Task properties applied for ${taskType}`);
    } catch (err) {
      console.error(`Error applying task properties for ${taskType}:`, err);
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
      style={{ position: "relative" }}
    />
  );
}
