
import * as CryptoJS from 'crypto-js';
import { appSettings } from './appsettings';
export class AppConstants {
    public static app_environment = "Local"; // UAT // Public // Local
    public static authority = "http://localhost:5000"
    public static clientId = "RecomAngularWeb";
    public static clientRoot = "http://localhost:4200";
    public static key = CryptoJS.enc.Utf8.parse(appSettings.key);
    public static iv = CryptoJS.enc.Utf8.parse(appSettings.key);

    public static True = "true";
    public static False = "false";
    public static OvertimeStatus = ["Approved", "Rejected", "Reverted", "Pending"];
}

export class ApiArea {
    public static controlpanel = "/controlpanel";
    public static hrms = "/hrms";
    public static payroll = "/payroll";
    public static pf = "/ProvidentFund";
    public static webservice = "/ws";
    public static asset = "/asset";
    public static tools = "/tools";
    public static expensereimbursement = "/ExpenseReimbursement";
}

export class ApiController {
    // Area of ControlPanel
    public static administration = "/administration";
    public static usermanagment = "/usermanagement";

    // Area of Web Service
    public static hrService = "/hrservice"
    public static controlPanelService = "/controlPanelService"
    public static payrollService = "/payrollService"

    // Area of HRM
    public static hr = "/hr"
    public static employees = "/employees";
    public static attendance = "/attendance"
    public static leave = "/leave";
    public static setup = "/setup"
    public static workshift = "/workshift"
    public static separation = "/separation"
    public static hr_report = "/hrReport"
    public static clientHR = "/clientHR"
    public static LateConsideration = "/LateConsideration";
    public static googleAuth = "/GoogleAuthenticator";


    // Area of Payroll
    public static allowance = "/allowance";
    public static deduction = "/deduction";
    public static payrollSetup = "/setup";
    public static salary = "/salary";
    public static reports = "/reports";
    public static tax = "/tax";
    public static bonus = "/bonus";
    public static ApiBase = "/ApiBase";
    public static Overtime = "/Overtime";
    public static EasyTax = "/EasyTax";
    //.....
}

export class ApiUrl {
    public static PWC = "http://103.239.253.11:5000/api";
    public static PWC_Cloud = "http://10.89.92.100:90/api";
    public static AgaKhan = "https://agakhan.myrecombd.com:8056/api";
    public static Hris = "https://hris.myrecombd.com:8090/api";
    public static Wounderman = "https://appsapi.wtmsc.com/api";
    public static UAT = "http://103.239.253.11:9098/api";
    public static Local = "http://localhost:5000/api";
    public static ITX = "https://itxbd.myrecombd.com:9623/api";
}

export class ImageUrl {
    public static Hris = "https://hris.myrecombd.com:3339/";
    public static Local = "http://localhost:5010/";
    public static Wounderman = "https://appsimages.wtmsc.com/";
    public static AgaKhan = "https://agakhan.myrecombd.com:8056/"
    public static PWC = "https://appsimages.wtmsc.com/";
    public static PWC_Cloud = "http://10.89.92.100:91/api";
    public static ITX = "https://hris.myrecombd.com:3339/";
}