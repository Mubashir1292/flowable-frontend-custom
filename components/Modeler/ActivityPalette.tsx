"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapseable";
import { ScrollArea } from "@/components/ui/scroll_area";
import {
  ChevronRight,
  ChevronDown,
  Square,
  Code2,
  Layers,
  GitBranch,
  Users,
  Settings,
  Mail,
  GitCommit,
  Network,
  Zap,
  BookOpen,
  CheckCircle2,
  Activity,
} from "lucide-react";

interface ActivityItem {
  id: string;
  label: string;
  bpmnType: string;
  taskType?: string;
  icon: any;
  description: string;
  properties?: Record<string, any>;
}

const activityCategories: ActivityItem[] = [
  // Standard Tasks
  {
    id: "task",
    label: "Task",
    bpmnType: "bpmn:Task",
    icon: Square,
    description: "Generic Task",
  },
  {
    id: "user-task",
    label: "User Task",
    bpmnType: "bpmn:UserTask",
    taskType: "userTask",
    icon: Users,
    description: "User Task - assigned to users",
    properties: {
      assignee: "",
      candidateUsers: [],
      candidateGroups: [],
      dueDate: null,
      priority: 50,
    },
  },

  // Service & Connector Tasks
  {
    id: "service-task",
    label: "Service Task",
    bpmnType: "bpmn:ServiceTask",
    taskType: "serviceTask",
    icon: Settings,
    description: "Service Task - delegates to service",
    properties: {
      implementation: "##Service",
      type: "service",
      expression: "",
      delegateExpression: "",
    },
  },
  {
    id: "camel-task",
    label: "Camel Task",
    bpmnType: "bpmn:ServiceTask",
    taskType: "camelTask",
    icon: GitCommit,
    description: "Camel Task - Apache Camel connector",
    properties: {
      type: "camel",
      camelContext: "",
      activitiEndpoint: "",
      serviceImplementation: "org.apache.camel.flowable.CamelBehaviour",
    },
  },
  {
    id: "http-task",
    label: "Http Task",
    bpmnType: "bpmn:ServiceTask",
    taskType: "httpTask",
    icon: Network,
    description: "Http Task - HTTP connector",
    properties: {
      type: "http",
      requestMethod: "GET",
      requestUrl: "",
      requestHeaders: {},
      requestBody: "",
      responseVariable: "httpResponse",
    },
  },
  {
    id: "mule-task",
    label: "Mule Task",
    bpmnType: "bpmn:ServiceTask",
    taskType: "muleTask",
    icon: Zap,
    description: "Mule Task - Mule ESB connector",
    properties: {
      type: "mule",
      endpointUrl: "",
      muleTransformer: "",
      payloadExpression: "",
    },
  },
  {
    id: "mail-task",
    label: "Mail Task",
    bpmnType: "bpmn:SendTask",
    taskType: "mailTask",
    icon: Mail,
    description: "Mail Task - Send email notification",
    properties: {
      type: "mail",
      to: "",
      from: "",
      subject: "",
      html: "",
      text: "",
      cc: "",
      bcc: "",
      charset: "utf-8",
    },
  },

  // Script & Logic Tasks
  {
    id: "script-task",
    label: "Script Task",
    bpmnType: "bpmn:ScriptTask",
    taskType: "scriptTask",
    icon: Code2,
    description: "Script Task - Execute script",
    properties: {
      scriptFormat: "JavaScript",
      script: "",
      resultVariable: "",
      autoStoreVariables: true,
    },
  },
  {
    id: "business-rule-task",
    label: "Business Rule Task",
    bpmnType: "bpmn:BusinessRuleTask",
    taskType: "businessRuleTask",
    icon: BookOpen,
    description: "Business Rule Task - Execute decision logic",
    properties: {
      decisionRef: "",
      resultVariable: "result",
      mapDecisionResult: "resultList",
      skipExpression: null,
    },
  },
  {
    id: "decision-task",
    label: "Decision Task",
    bpmnType: "bpmn:BusinessRuleTask",
    taskType: "decisionTask",
    icon: CheckCircle2,
    description: "Decision Task - DMN decision table",
    properties: {
      decisionTableKey: "",
      decisionRef: "",
      resultVariable: "result",
      mapDecisionResult: "resultList",
      decisionRefExpression: "",
    },
  },

  // Communication & Interaction Tasks
  {
    id: "receive-task",
    label: "Receive Task",
    bpmnType: "bpmn:ReceiveTask",
    taskType: "receiveTask",
    icon: Activity,
    description: "Receive Task - Wait for message",
    properties: {
      messageRef: "",
      messageQueueName: "",
      correlationKey: "",
      instantiate: false,
    },
  },
  {
    id: "manual-task",
    label: "Manual Task",
    bpmnType: "bpmn:ManualTask",
    taskType: "manualTask",
    icon: CheckCircle2,
    description: "Manual Task - Manual intervention required",
    properties: {
      documentation: "",
      skipExpression: null,
    },
  },

  // Subprocess & Reusable Elements
  {
    id: "subprocess",
    label: "Subprocess",
    bpmnType: "bpmn:SubProcess",
    icon: Layers,
    description: "Embedded Sub-Process",
  },
  {
    id: "call-activity",
    label: "Call Activity",
    bpmnType: "bpmn:CallActivity",
    icon: GitBranch,
    description: "Call Activity - Invoke another process",
    properties: {
      calledElement: "",
      inheritVariables: true,
    },
  },
];

interface ActivityPaletteProps {
  onActivityDragStart?: (event: React.DragEvent, data: ActivityItem) => void;
}

export default function ActivityPalette({ onActivityDragStart }: ActivityPaletteProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    "Tasks",
    "Connectors",
  ]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleDragStart = (e: React.DragEvent, item: ActivityItem) => {
    e.dataTransfer.setData("application/bpmn-type", item.bpmnType);
    e.dataTransfer.setData("application/bpmn-label", item.label);
    e.dataTransfer.setData("application/bpmn-task-type", item.taskType || "");

    // Send properties as JSON
    if (item.properties) {
      e.dataTransfer.setData(
        "application/bpmn-properties",
        JSON.stringify(item.properties)
      );
    }

    e.dataTransfer.effectAllowed = "copy";
    if (onActivityDragStart) {
      onActivityDragStart(e, item);
    }
  };

  const renderActivityItem = (item: ActivityItem) => {
    const Icon = item.icon;
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md cursor-move transition-colors group"
        title={item.description}
      >
        <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600 flex-shrink-0" />
        <span className="truncate">{item.label}</span>
      </div>
    );
  };

  const groupsByCategory = () => {
    return {
      "Tasks": activityCategories.filter((a) =>
        ["task", "user-task", "manual-task", "receive-task"].includes(a.id)
      ),
      "Connectors": activityCategories.filter((a) =>
        [
          "service-task",
          "camel-task",
          "http-task",
          "mule-task",
          "mail-task",
        ].includes(a.id)
      ),
      "Logic & Rules": activityCategories.filter((a) =>
        ["script-task", "business-rule-task", "decision-task"].includes(a.id)
      ),
      "Subprocess": activityCategories.filter((a) =>
        ["subprocess", "call-activity"].includes(a.id)
      ),
    };
  };

  const groups = groupsByCategory();

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
              {items.length > 0 ? (
                items.map(renderActivityItem)
              ) : (
                <div className="px-2 py-1 text-xs text-slate-400">
                  No items
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  );
}
