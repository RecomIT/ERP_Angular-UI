import { OvertimeApprover } from "./overtime-approver";

export class OvertimeSaveRequest {

  employeeId : number = 0;
  overtimeId : number = 0;
  requestDate? : Date | null;
  startTime? :Date | null;
  endTime? : Date | null;
  remarks : string = "";
  approvers : OvertimeApprover[] = [];
}





