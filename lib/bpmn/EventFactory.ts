import { BpmnModdle } from "bpmn-moddle";
export interface BpmnEventConfig {
  type:
    | "start"
    | "end"
    | "intermediateCatch"
    | "intermediateThrow"
    | "boundary";
  eventType:
    | "none"
    | "timer"
    | "message"
    | "signal"
    | "error"
    | "conditional"
    | "link"
    | "cancel"
    | "compensate"
    | "terminate";
  name?: string;
  id?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  eventDefinition?: any;
}

export class EventFactory {
  private moddle: any;

  constructor() {
    this.moddle = new BpmnModdle();
  }

  async createEvent(config: BpmnEventConfig): Promise<any> {
    const { type, eventType, name, id, x, y, width = 36, height = 36 } = config;

    let eventDefinition;
    let eventDefinitionType;

    switch (eventType) {
      case "timer":
        eventDefinitionType = "bpmn:TimerEventDefinition";
        break;
      case "message":
        eventDefinitionType = "bpmn:MessageEventDefinition";
        break;
      case "signal":
        eventDefinitionType = "bpmn:SignalEventDefinition";
        break;
      case "error":
        eventDefinitionType = "bpmn:ErrorEventDefinition";
        break;
      case "conditional":
        eventDefinitionType = "bpmn:ConditionalEventDefinition";
        break;
      case "link":
        eventDefinitionType = "bpmn:LinkEventDefinition";
        break;
      case "cancel":
        eventDefinitionType = "bpmn:CancelEventDefinition";
        break;
      case "compensate":
        eventDefinitionType = "bpmn:CompensateEventDefinition";
        break;
      case "terminate":
        eventDefinitionType = "bpmn:TerminateEventDefinition";
        break;
      default:
        eventDefinitionType = null;
    }

    if (eventDefinitionType) {
      eventDefinition = await this.moddle.create(eventDefinitionType, {});
    }

    let bpmnType;
    switch (type) {
      case "start":
        bpmnType = "bpmn:StartEvent";
        break;
      case "end":
        bpmnType = "bpmn:EndEvent";
        break;
      case "intermediateCatch":
        bpmnType = "bpmn:IntermediateCatchEvent";
        break;
      case "intermediateThrow":
        bpmnType = "bpmn:IntermediateThrowEvent";
        break;
      case "boundary":
        bpmnType = "bpmn:BoundaryEvent";
        break;
      default:
        throw new Error(`Unknown event type: ${type}`);
    }

    const event = await this.moddle.create(bpmnType, {
      id: id || `${bpmnType.split(":")[1]}_${Date.now()}`,
      name:
        name ||
        `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} ${type} Event`,
      eventDefinitions: eventDefinition ? [eventDefinition] : undefined,
    });

    return {
      bpmnElement: event,
      di: await this.moddle.create("bpmndi:BPMNShape", {
        id: `${event.id}_di`,
        bpmnElement: event,
        Bounds: await this.moddle.create("dc:Bounds", {
          x,
          y,
          width,
          height,
        }),
      }),
    };
  }

  getEventIcon(type: string, eventType: string): string {
    const icons: Record<string, Record<string, string>> = {
      start: {
        none: "○",
        timer: "⏰",
        message: "✉",
        signal: "📡",
        error: "⚠",
        conditional: "📋",
        link: "🔗",
      },
      end: {
        none: "●",
        timer: "⏰",
        message: "✉",
        signal: "📡",
        error: "⚠",
        link: "🔗",
        cancel: "❌",
        compensate: "↺",
        terminate: "",
      },
      intermediateCatch: {
        timer: "⏰",
        message: "✉",
        signal: "📡",
        link: "🔗",
        conditional: "📋",
      },
      intermediateThrow: {
        message: "✉",
        signal: "📡",
        link: "🔗",
        compensate: "↺",
      },
      boundary: {
        timer: "⏰",
        error: "⚠",
        signal: "📡",
        message: "✉",
        cancel: "❌",
        compensate: "↺",
      },
    };

    return icons[type]?.[eventType] || "○";
  }
}

export const eventFactory = new EventFactory();
