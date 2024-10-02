export interface  baseModel{
    userId: string,
    createdBy: string,
    createdDate: Date | null,
    updatedBy: string,
    updatedDate: Date |null,
    approvedBy: string,
    approvedDate: Date |null,
    checkedBy : string,
    checkedDate: Date | null,
    branchId: number,
    branchName: string,
    divisionId: number,
    divisionName: string,
    companyId: number,
    companyName: string,
    organizationId: number,
    organizationName: string
}

export interface DatePickerConfig{
    containerClass: string,
    showWeekNumbers: boolean,
    dateInputFormat:string,
    isAnimated: boolean,
    showClearButton: boolean,
    showTodayButton: boolean,
    todayPosition: string,
    rangeInputFormat: string,
    rangeSeparator: string,
    size: string,
    minDate: Date | null,
    customTodayClass:string
}