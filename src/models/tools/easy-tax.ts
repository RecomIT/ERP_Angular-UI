export class EasyTax {

  employeeId: String = '';
  employeeName: string;
  designation : String;
  gender: string = 'Male';
  tin: string = '';
  region : string = 'Dhaka';
  overAged: boolean = false;  //Aged >= 65
  physicallyChallenged: boolean = false;
  freedomFighters: boolean = false;


  
  // Allowances 

  grossIncome = 0;
  basic : SalaryComponent =  { id: 1, name: 'Basic Salary', code: 'Basic', amount: 0, type: 'A' };
  houseRent : SalaryComponent =  { id: 2, name: 'House Rent Allowance', code: 'HR', amount: 0, type: 'A' };
  medical : SalaryComponent =  { id: 3, name: 'Medical Allowance', code: 'Medical', amount: 0, type: 'A' };
  conveyance : SalaryComponent =  { id: 4, name: 'Conveyance', code: 'Conveyance', amount: 0, type: 'A' };

  
  bonus : SalaryComponent =  { id: 5, name: 'Bonus', code: 'Bonus', amount: 0, type: 'A' };
  pf : SalaryComponent =  { id: 6, name: 'Company Contribution to PF (CCPF)', code: 'PF', amount: 0, type: 'A' };
  
  otherAllowances : SalaryComponent =  { id: 7, name: 'Other Allowances', code: 'otherAllowances', amount: 0, type: 'A' };
  
  //gf : SalaryComponent =  { id: 8, name: 'Gratuity Fund', code: 'gf', amount: 0, type: 'A' };
  
  // transportation : SalaryComponent =  { id: 9, name: 'Transportation', code: 'Transportation', amount: 0, type: 'A' };
  // incentive : SalaryComponent =  { id: 10, name: ' Incentive', code: ' Incentive', amount: 0, type: 'A' };
  // earnLeave : SalaryComponent =  { id: 11, name: 'Earn Leave', code: 'Earn Leave', amount: 0, type: 'A' };
  // carAllowance : SalaryComponent =  {  id: 12, name: 'Car Allowance', code: 'carAllowance', amount: 0, type: 'A' };


  //Deductions

  // lwp : SalaryComponent =  { id: 31, name: 'Leave Without Pay (LWP)', code: 'LWP', amount: 0, type: 'D' };
  // suspension : SalaryComponent =  { id: 32, name: 'Suspension', code: 'Suspension', amount: 0, type: 'D' };
  // otherDeductions : SalaryComponent =  { id: 33, name: 'Other Deductions', code: 'otherDeductions', amount: 0, type: 'D' };

  actualInvestmentAmount : number = 0;
  aitAmount : number = 0;
  refundAmount : number = 0;
}


export class SalaryComponent {

  id : number = 0;
  name : String = '';
  code : String = '';
  amount : number = 0;
  type : String = '';
}
