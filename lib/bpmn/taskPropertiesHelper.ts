/**
 * Task Properties Helper - Centralized configuration for all BPMN task types
 * Provides type-safe task property definitions
 */

export interface TaskConfig {
  taskType: string;
  bpmnType: string;
  label: string;
  defaultProperties: Record<string, any>;
}

export const TASK_CONFIGURATIONS: Record<string, TaskConfig> = {
  userTask: {
    taskType: "userTask",
    bpmnType: "bpmn:UserTask",
    label: "User Task",
    defaultProperties: {
      assignee: "",
      candidateUsers: [],
      candidateGroups: [],
      dueDate: null,
      priority: 50,
      skipExpression: null,
    },
  },
  serviceTask: {
    taskType: "serviceTask",
    bpmnType: "bpmn:ServiceTask",
    label: "Service Task",
    defaultProperties: {
      implementation: "##Service",
      type: "service",
      expression: "",
      delegateExpression: "",
      resultVariable: "",
    },
  },
  camelTask: {
    taskType: "camelTask",
    bpmnType: "bpmn:ServiceTask",
    label: "Camel Task",
    defaultProperties: {
      type: "camel",
      camelContext: "",
      activitiEndpoint: "",
      serviceImplementation: "org.apache.camel.flowable.CamelBehaviour",
    },
  },
  httpTask: {
    taskType: "httpTask",
    bpmnType: "bpmn:ServiceTask",
    label: "Http Task",
    defaultProperties: {
      type: "http",
      requestMethod: "GET",
      requestUrl: "",
      requestHeaders: {},
      requestBody: "",
      responseVariable: "httpResponse",
      ignoreStatusCode: false,
    },
  },
  muleTask: {
    taskType: "muleTask",
    bpmnType: "bpmn:ServiceTask",
    label: "Mule Task",
    defaultProperties: {
      type: "mule",
      endpointUrl: "",
      muleTransformer: "",
      payloadExpression: "",
    },
  },
  mailTask: {
    taskType: "mailTask",
    bpmnType: "bpmn:SendTask",
    label: "Mail Task",
    defaultProperties: {
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
  scriptTask: {
    taskType: "scriptTask",
    bpmnType: "bpmn:ScriptTask",
    label: "Script Task",
    defaultProperties: {
      scriptFormat: "JavaScript",
      script: "",
      resultVariable: "",
      autoStoreVariables: true,
    },
  },
  businessRuleTask: {
    taskType: "businessRuleTask",
    bpmnType: "bpmn:BusinessRuleTask",
    label: "Business Rule Task",
    defaultProperties: {
      decisionRef: "",
      resultVariable: "result",
      mapDecisionResult: "resultList",
      skipExpression: null,
    },
  },
  decisionTask: {
    taskType: "decisionTask",
    bpmnType: "bpmn:BusinessRuleTask",
    label: "Decision Task",
    defaultProperties: {
      decisionTableKey: "",
      decisionRef: "",
      resultVariable: "result",
      mapDecisionResult: "resultList",
      decisionRefExpression: "",
    },
  },
  receiveTask: {
    taskType: "receiveTask",
    bpmnType: "bpmn:ReceiveTask",
    label: "Receive Task",
    defaultProperties: {
      messageRef: "",
      messageQueueName: "",
      correlationKey: "",
      instantiate: false,
    },
  },
  manualTask: {
    taskType: "manualTask",
    bpmnType: "bpmn:ManualTask",
    label: "Manual Task",
    defaultProperties: {
      documentation: "",
      skipExpression: null,
    },
  },
};

/**
 * Get task configuration by type
 */
export function getTaskConfig(taskType: string): TaskConfig | undefined {
  return TASK_CONFIGURATIONS[taskType];
}

/**
 * Get default properties for a task type
 */
export function getDefaultProperties(taskType: string): Record<string, any> {
  return TASK_CONFIGURATIONS[taskType]?.defaultProperties || {};
}

/**
 * Get BPMN type from task type
 */
export function getBpmnType(taskType: string): string {
  return TASK_CONFIGURATIONS[taskType]?.bpmnType || "bpmn:Task";
}
