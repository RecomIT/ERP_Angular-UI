export class OvertimePolicy {
    overtimeId: number = 0;
    overtimeName: string;
    overtimeNameInBengali?: string;
    unit: string;
    amountType: string;
    isFlatAmountType: boolean = false;
    isPercentageAmountType: boolean = false;
    amount: number = 0;
    amountRate: number = 1;
    limitationOfUnit:boolean = false;
    maxUnit: number = 0;
    minUnit: number = 0;
    limitationOfAmount: boolean = false;
    maxAmount: number = 0;
    minAmount: number = 0;
    createdDate?: Date | null;                                                          
    updatedDate?: Date | null;
  
  }
  
  
  
  
  
  