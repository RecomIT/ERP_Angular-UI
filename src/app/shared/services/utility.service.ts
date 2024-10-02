import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UtilityService {

    private toastrTimeOut: number = 1500;
    constructor(public toastr: ToastrService, private httpClient: HttpClient) {
    }

    public currentYear: string = (new Date()).getFullYear().toString();
    public currentMonth: string = ((new Date()).getMonth() + 1).toString();


    // response type
    ServerResponse: string = "Server Reponse";
    SiteResponse: string = "Site Reponse";

    // response message
    SomethingWentWrong: string = "Something went wrong";
    ServerResponsedWithErorr: string = "Server responsed with erorr";
    InvalidParameters: string = "Invalid Parameters";
    InvalidExecution: string = "Invalid Execution";
    SaveComplete: string = "Save Complete";

    SuccessfullySaved: string = "Successfully Saved";

    listResponseMessages() {
        return [{ type: this.ServerResponse, msg: this.SomethingWentWrong },
        { type: this.ServerResponse, msg: this.ServerResponsedWithErorr },
        { type: this.ServerResponse, msg: this.InvalidParameters },
        { type: this.ServerResponse, msg: this.InvalidExecution }]
    }

    arrayUnique(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    }
    

    downloadFile(response: any, fileType: any, fileName: string = "file") {
        if (response != null) {
            if (response.size > 0) {
                var blob = new Blob([response], { type: fileType });
                var file_link = document.createElement('a');
                let fileUrl = window.URL.createObjectURL(blob);

                //console.log('fileUrl >>>', fileUrl);

                file_link.href = fileUrl;
                file_link.download = fileName;
                if (fileName.toLowerCase().lastIndexOf('pdf') > -1) {
                    window.open(fileUrl, '_blank');
                }
                else {
                    file_link.click();
                }

            }
        }
    }

    select2Config() {
        return {
            width: "100%",
            containerCssClass: "form-control form-control-sm text-x-small font-bold redius-none",
            theme: "bootstrap4"

        }
    }

    datePickerConfig() {
        return {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left",
            rangeInputFormat: "DD-MMM-YYYY",
            rangeSeparator: " ~ ",
            size: "sm",
            customTodayClass: 'custom-today-class',
            maxDate: null
        }
    }

    getYears(count: number) {
        let today = new Date();
        let years = [];
        let totalYears = (today.getFullYear() - count);

        for (let index = 0; index < count; index++) {
            years.push(today.getFullYear() - index)
        }
        return years;
    }

    getYearsUp(count: number) {
        let today = new Date();
        let years = [];
        let totalYears = (today.getFullYear() + count);

        for (let index = 0; index < count; index++) {
            years.push(today.getFullYear() + index)
        }
        return years;
    }

    getMonthName(month: number): string {
        const date = new Date(2000, month - 1, 1);
        return date.toLocaleString('en-us', { month: 'short' });
    }

    getMonthNameFull(month: number): string {
        if(month == null || month == 0){
            return "";
        }
        const date = new Date(2000, month - 1, 1);
        return date.toLocaleString('en-us', { month: 'long' });
    }

    randerFile(response: any, type: any) {
        if (type == 'application/pdf') {
            var blob = new Blob([response], { type: 'application/pdf' });
            let pdfUrl = window.URL.createObjectURL(blob);

            var PDF_link = document.createElement('a');
            PDF_link.href = pdfUrl;
            window.open(pdfUrl, '_blank');
        }
        else if (type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'All_Leave_Report.xlsx';
            link.click();
        }
    }

    fileExtension(fileName: string) {
        var name = fileName.split('.')
        return name[1].toString();
    }

    getReligions() {
        return ["ISLAM", "HINDU", "CHRISTIAN", "BUDDIST"];
    }

    getBloodGroup() {
        return ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    }


    getFirstDate(month: number, year: number) {
        var date = new Date(year, (month - 1), 1);
        return date;
    }

    getLastDate(month: number, year: number) {
        var date = new Date(year, month, 1);
        var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 0);
        return lastDayOfMonth;

    }

    convertUTCDateToLocalDate(date: Date) {
        var newDate = new Date(date.getDate() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }

    getMaritals() {
        return ["Single", "Married", "Divorced", "Widowed", "Separated"];
    }

    getGenders() {
        return ["Male", "Female"];
    }

    getRelations() {
        return ["Father", "Mother", "Sister", "Brother", "Husband", "Wife", "Son", "Dougther", "Father-In-Law", "Mother-In-Law", "Uncle In Father Side", "Uncle In Mother Side", "Aunt In Father Side", "Aunt In Mother Side", "Brother-In-Law", "Sister-In-Law"];
    }

    getTaxSlabImpliedCondition() {
        return ["Male", "Female", "Freedom Fighter", "Physically Disabled", "Common Gender", "Above 65y", "Regardleass","Non Residential"];
    }

    getOperators() {
        return ["<", ">", "<=", ">="];
    }

    consoleLog(message?: any, ...optionalParams: any[]): void {
        if (optionalParams == undefined || optionalParams == null) {
            console.log(message);
        }
        else {
            console.log(message, optionalParams);
        }
    }

    getNextDate() {
        let today = new Date();
        today.setUTCDate(today.getDate() + 1);
        console.log("today", today)
        return today;
    }


    httpErrorMsg(status: any, msg: any) {
        console.log(status);
        console.log(status);
        if (status == 400) {
            this.fail(msg, "Server Response");
        }
        else if (status == 404) {
            this.warning("No data found", "Server Response");
        }
        else if (status == 401) {
            this.fail("Unauthorozed Activity", "Server Response");
        }
        else if (status == 501) {
            this.fail("Server responsed with error", "Server Response");
        }
        else {
            this.fail("Something went wrong", "Server Response");
        }
    }

    success(message: string = "", title: string = "", timeOut: number = 0) {
        timeOut = timeOut <= 0 ? this.toastrTimeOut : timeOut;
        this.toastr.success((message == "" ? "Successfull Execution" : message), (title == "" ? "Server Response" : title), { timeOut: timeOut, enableHtml: true })
    }

    fail(message: string = "", title: string = "", timeOut: number = 0) {
        timeOut = timeOut <= 0 ? this.toastrTimeOut : timeOut;
        this.toastr.error((message == "" ? "UnSuccessfull Execution" : message), (title == "" ? "Server Response" : title), { timeOut: timeOut, enableHtml: true })
    }

    info(message: string = "", title: string = "", timeOut: number = 0) {
        timeOut = timeOut <= 0 ? this.toastrTimeOut : timeOut;
        this.toastr.info((message == "" ? "Notifying" : message), (title == "" ? "Server Response" : title), { timeOut: timeOut })
    }

    warning(message: string = "", title: string = "", timeOut: number = 0) {
        timeOut = timeOut <= 0 ? this.toastrTimeOut : timeOut;
        this.toastr.warning((message == "" ? "Warning" : message), (title == "" ? "Server Response" : title), { timeOut: timeOut })
    }

    httpErrorHandler(error: any, message: string = "", title: string = "", timeOut: number = 0) {
        timeOut = timeOut <= 0 ? this.toastrTimeOut : timeOut;
        console.log("error >>", error);
        this.toastr.error((message == "" ? "Something went wrong" : message), (title == "" ? "Server Response" : title), { timeOut: timeOut })
    }

    getDateAfterToday(nextDateNumber: number) {
        let today = new Date();
        today.setUTCDate(today.getDate() + nextDateNumber);
        console.log("today", today)
        return today;
    }

    getDateBeforeToday(beforeDateNumber: number) {
        let pastDate = new Date();
        pastDate.setUTCDate(pastDate.getDate() - beforeDateNumber);
        console.log("pastDate", pastDate)
        return pastDate;
    }

    // Function to get a date before a specified date
    getDateBeforeEDD(EDDDate: Date, beforeDateNumber: number) {
        let pastDate = new Date(EDDDate); // Make a copy of the EDDDate
        pastDate.setUTCDate(pastDate.getDate() - beforeDateNumber);
        return pastDate;
    }

    getHandleError(error: HttpErrorResponse) {
        console.error('server error: ', error);
        if (error.error instanceof Error) {
            const errMessage = error.error.message;
            return throwError(errMessage);
        }
        return new Observable<never>();
    }

    getMonths() {
        return [
            { month: "January", monthNo: 1, monthNoBN: "১", days: 31, monthBN: "জানুয়ারী", daysBN: "৩১" },
            { month: "February", monthNo: 2, monthNoBN: "২", days: 28, monthBN: "ফেব্রুয়ারি", daysBN: "২৮" },
            { month: "March", monthNo: 3, monthNoBN: "৩", days: 31, monthBN: "মার্চ", daysBN: "৩১" },
            { month: "April", monthNo: 4, monthNoBN: "৪", days: 30, monthBN: "এপ্রিল", daysBN: "৩০" },
            { month: "May", monthNo: 5, monthNoBN: "৫", days: 31, monthBN: "মে", daysBN: "৩১" },
            { month: "June", monthNo: 6, monthNoBN: "৬", days: 30, monthBN: "জুন", daysBN: "৩০" },
            { month: "July", monthNo: 7, monthNoBN: "৭", days: 31, monthBN: "জুলাই", daysBN: "৩১" },
            { month: "August", monthNo: 8, monthNoBN: "৮", days: 31, monthBN: "আগস্ট", daysBN: "৩১" },
            { month: "September", monthNo: 9, monthNoBN: "৯", days: 30, monthBN: "সেপ্টেম্বর", daysBN: "৩০" },
            { month: "October", monthNo: 10, monthNoBN: "১০", days: 31, monthBN: "অক্টোবর", daysBN: "৩১" },
            { month: "November", monthNo: 11, monthNoBN: "১১", days: 30, monthBN: "নভেম্বর", daysBN: "৩০" },
            { month: "December", monthNo: 12, monthNoBN: "১২", days: 31, monthBN: "ডিসেম্বর", daysBN: "৩১" }
        ]
    }

    getHoldReasons() {
        return [
            "Joining", "Termination", "Penalty", "Hold", "Others"
        ]
    }

    getDateWithSetTime(value: string) {
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        if (value != null && value != undefined && value != null) {
            let hh = value.substring(0, 2);
            let mm = value.substring(3, 5);
            date.setHours(parseInt(hh), parseInt(mm), 0, 0);
        }
        return date;
    }

    getDays() {
        return [
            { dayName: "Friday", dayNameBN: "শুক্রবার" },
            { dayName: "Saturday", dayNameBN: "শনিবার" },
            { dayName: "Sunday", dayNameBN: "রবিবার" },
            { dayName: "Monday", dayNameBN: "সোমবার" },
            { dayName: "Tuesday", dayNameBN: "মঙ্গলবার" },
            { dayName: "Wednesday", dayNameBN: "বুধবার" },
            { dayName: "Thursday", dayNameBN: "বৃহস্পতিবার" }
        ];
    }

    getDates() {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    }

    getDatesBN() {
        return ["১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "১০", "১১", "১২", "১৩", "১৪", "১৫", "১৬", "১৭", "১৮", "১৯",
            "২০", "২১", "২২", "২৩", "২৪", "২৫", "২৬", "২৭", "২৮", "২৯", "৩০", "৩১"];
    }

    getYearlyHolidayTypes() {
        return ["Public", "Official", "Emergency"];
    }

    IntTryParse(value: any): number {
        if (value == null || value == undefined || value == '') {
            return 0;
        }
        else {
            if (!isNaN(value)) {
                return parseInt(value);
            }
            return 0;
        }
    }

    FloatTryParse(value: any): number {
        if (value == null || value == undefined || value == '') {
            return 0;
        }
        else {
            if (!isNaN(value)) {
                return parseFloat(value);
            }
            return 0;
        }
    }

    getDropDownText(id: any, list: any[]): string {
        const selObj = list.find(s => s.id == id).text;
        return selObj;
    }

    getJobTypes() {
        return ["Permanent", 'Probation', 'Contractual', "Intern", "Freelancer"]
    }

    getPaymentModes() {
        return ["Cash", "Bank", "Mobile Banking"];
    }

    getMobileBankAgents() {
        return ["bKash", "Nagad", "upay", "UCash", "Rocket"];
    }

    getPaymentTypes() {
        return ["Bank", "bKash", "Nagad", "Rocket"];
    }

    getDataStatus() {
        return ["Entered", "Pending", "Approved", "Recheck", "Checked", "Cancelled", "Rejected", "Disbursed"]
    }

    getDateDiffInDays(date1: any, date2: any) {
        const diffInMs = Math.abs(date2 - date1);
        return Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }

    getDateDiffInHours(date1: any, date2: any) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60);
    }

    getDateDiffInMinutes(date1: any, date2: any) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60);
    }

    getDateDiffInSeconds(date1: any, date2: any) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / 1000;
    }

    getFirstDateOfAGivenMonth(month: any, year: any) {
        var date = new Date("2022-10-01");
    }

    getMonthDiff(date1: Date, date2: Date): number {
        const months = (date2.getFullYear() - date1.getFullYear()) * 12;
        const monthDiff = date2.getMonth() - date1.getMonth();
        return months + monthDiff;
    }

    getMonthListBetweenTwoDate(date1: Date, date2: Date) {
        let months = [];
        let month_diff = this.getMonthDiff(date1, date2) + 1;
        //console.log('month_diff >>>', month_diff);
        let date_month = date1;
        for (let i = 1; i <= month_diff; i++) {
            if (i == 1) {
                months.push({ monthNo: date1.getMonth() + i, monthName: this.getMonthNameFull(date1.getMonth() + i), year: date1.getFullYear() });
            }
            else {
                let month = new Date(date_month.setMonth(date_month.getMonth() + 1));
                //console.log("month in  >>>", month);
                months.push({
                    monthNo: month.getMonth() + 1,
                    monthName: this.getMonthNameFull(month.getMonth() + 1),
                    year: month.getFullYear() //(month.getMonth() + 1) == 11 ? month.getFullYear() + 1 : month.getFullYear()
                });
            }
        }
        return months;
    }

}