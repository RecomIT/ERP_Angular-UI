import { OvertimeEmployee } from "./overtime-employee";
import { OvertimePolicy } from "./overtime-policy";
import { OvertimeRequestDetails } from "./overtime-request-details";

export class OvertimeRequest {
  overtimeRequestId : number = 0;
  employee : OvertimeEmployee = new OvertimeEmployee();
  overtimeType : OvertimePolicy = new OvertimePolicy();
  requestDate?: Date | null; 

  startTime?: Date | null;  // 
  endTime?: Date | null; 
  applicationDate?: Date | null; 
  remarks : string = "";
  status : string = "";
  waitingStage : string = "";
  createdDate?: Date | null;
  updatedDate?: Date | null;
  overtimeRequestDetails: OvertimeRequestDetails[] =[];
}











