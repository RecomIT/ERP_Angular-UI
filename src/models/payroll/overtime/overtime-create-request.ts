import { OvertimeApprover } from "./overtime-approver";
import { OvertimeEmployee } from "./overtime-employee";
import { OvertimePolicy } from "./overtime-policy";

export class OvertimeCreateRequest {
  overtimeTypes : OvertimePolicy [] =[];
  minApprovalLevel : number = 1;
  maxApprovalLevel : number = 1;
  approvers: OvertimeApprover [] =[];
  teamMembers: OvertimeEmployee[] = [];
}





