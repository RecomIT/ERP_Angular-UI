export class OvertimeApprover {
  overtimeApproverId: number = 0;
  employeeId: number = 0;
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  division: string;
  branch: string;
  isActive: boolean = false;
  proxyEnabled: boolean = false;
  proxyApproverId: number = 0;
  createdDate?: Date | null;
  updatedDate?: Date | null;
  approvalOrder : number = 1;

}





