import { BPMNModdle } from "bpmn-moddle";

declare module 'bpmn-js/lib/Modeler' {
  const BpmnModeler: BPMNModdle;
  export default BpmnModeler;
}

declare module 'bpmn-js-properties-panel' {
  export const BpmnPropertiesPanelModule: any;
  export const BpmnPropertiesProviderModule: any;
}

declare module 'camunda-bpmn-moddle' {
  const camundaModdleDescriptor: any;
  export default camundaModdleDescriptor;
}