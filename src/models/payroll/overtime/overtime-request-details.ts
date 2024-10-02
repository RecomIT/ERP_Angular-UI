import { OvertimeApprover } from "./overtime-approver";

export class OvertimeRequestDetails {
  overtimeRequestDetailsId : number = 0;
  overtimeApproverId : number = 0;

  approver: OvertimeApprover = new OvertimeApprover();
  approvalOrder : number = 0;
  actionRequired : boolean = false;
  isReverted : boolean = false;
  remarks : string = "";
  status : string = "";
  processAt?: Date | null; 

}





