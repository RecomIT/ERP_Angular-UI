import { OvertimeApprover } from "./overtime-approver";
import { OvertimeEmployee } from "./overtime-employee";

export class OvertimeTeamApprovalMapping {
  overtimeTeamApprovalMappingId: number = 0;
  approver: OvertimeApprover = new OvertimeApprover();
  teamMembers: OvertimeEmployee[] = [];
  approvalLevel : number = 1;

  selectedEmployeeId : String = "0";
  selectedEmployeeList :  OvertimeEmployee[] = [];
  minApprovalLevel : number = 1;
  maxApprovalLevel : number = 1;
  

}





