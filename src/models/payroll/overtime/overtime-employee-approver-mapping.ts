import { OvertimeApprover } from "./overtime-approver";
import { OvertimeEmployee } from "./overtime-employee";

export class OvertimeEmployeeApproverMapping {
  overtimeTeamApprovalMappingId : number = 0;
  approver: OvertimeApprover = new OvertimeApprover();
  employee: OvertimeEmployee = new OvertimeEmployee();
  approvalLevel : number = 1;
  minApprovalLevel : number = 1;
  maxApprovalLevel : number = 1;
}





