import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ApiArea, ApiController } from '../constants';
import * as CryptoJS from 'crypto-js';
import { AppConstants } from '../constants';
import { EncryptorDecryptor } from './encryptor-decryptor';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private httpClient: HttpClient, private jwtHelper: JwtHelperService,) { }
    User() {
        return this.getUser();//{ BranchId: 3, DivisionId: 0, ComId: 5, OrgId: 7, UserId: "sysadmin", EmployeeId: 2 }
    }

    getUser() {
        if (this.isUserAuthenticated()) {
            const token = this.getToken();
            var userinfo = EncryptorDecryptor.decryptUsingAES256(this.jwtHelper.decodeToken<any>(token).userinfo);
            var userjson = JSON.parse(userinfo);
            //console.log("userjson >>>",userjson);
            return {
                BranchId: userjson?.branchId ?? 0, DivisionId: userjson.divisionId ?? 0, ComId: userjson.companyId,
                OrgId: userjson.organizationId, UserId: userjson.userId, EmployeeId: userjson?.employeeId ?? 0,
                DepartmentId: userjson?.departmentId ?? 0, DesignationId: userjson?.designationId ?? 0, Username: userjson.username, RoleId: userjson.roleId,
                RoleName: userjson.roleName, EmployeeCode: userjson.employeeCode, PhotoPath: userjson.photoPath, companyName: userjson?.companyName, 
                organizationName: userjson?.organizationName
            };
        }
        else {
            return { BranchId: 0, DivisionId: 0, ComId: 0, OrgId: 0, UserId: "", EmployeeId: 0, DesignationId: 0, DepartmentId: 0, Username: "", RoleId: 0, RoleName: "" }
        }
    }

    hasComponent(name: string) {
        const componentprivileges = localStorage.getItem("x-site-compt");
        var isComponentExist = false
        if (componentprivileges != null) {
            const components = EncryptorDecryptor.decryptUsingAES256(componentprivileges);
            const componentsJson = (<any[]>JSON.parse(components));
            var isComponentExist = componentsJson.find(item => item.name == name) == null ? false : true;
        }
        return isComponentExist;
    }

    getComponentPrivileges(name: string) {
        const componentprivileges = localStorage.getItem("x-site-compt");
        const components = EncryptorDecryptor.decryptUsingAES256(componentprivileges);
        const componentsJson = (<any[]>JSON.parse(components));
        var component = componentsJson.find(item => item.name == name);
        return component;
    }

    getUserInfo(): {} | null {
        if (this.isUserAuthenticated()) {
            const token = this.getToken();
            var userinfo = EncryptorDecryptor.decryptUsingAES256(this.jwtHelper.decodeToken<any>(token).userinfo);
            var userjson = JSON.parse(userinfo);
            // console.log("userjson >>>", userjson);
            return { username: userjson.username, roleName: userjson.roleName, name: userjson.employeeName, gradeId: userjson.gradeId, gradeName: userjson.gradeName, designationId: userjson.designationId, designationName: userjson.designationName, departmentId: userjson.departmentId, departmentName: userjson.departmentName, sectionId: userjson.sectionId, sectionName: userjson.sectionName, subSectionId: userjson.subSectionId, subSectionName: userjson.subSectionName, companyName: userjson?.companyName, organizationName: userjson?.organizationName };
        }
        else {
            return null
        }
    }

    getSiteThumbnailPath() {
        let path = "";
        if (this.isUserAuthenticated()) {
            const token = this.getToken();
            var userinfo = EncryptorDecryptor.decryptUsingAES256(this.jwtHelper.decodeToken<any>(token).userinfo);
            var userjson = JSON.parse(userinfo);
            path = userjson?.siteThumbnailPath;
        }

        return path;
    }


    getSiteShortName() {
        let shortName = "";
        if (this.isUserAuthenticated()) {
            const token = this.getToken();
            var userinfo = EncryptorDecryptor.decryptUsingAES256(this.jwtHelper.decodeToken<any>(token).userinfo);
            var userjson = JSON.parse(userinfo);
            shortName = userjson?.siteShortName;
        }
        return shortName;
    }

    getUserMenus(): any[] | null {

        if (this.isUserAuthenticated()) {
            const token = this.getToken();
            var usermenu = this.jwtHelper.decodeToken<any>(token).usermenu;
            var userjson = (<any[]>JSON.parse(usermenu));
            return userjson;
        }
        return null;
    }

    getUserName(): string | null {
        if (this.isUserAuthenticated()) {
            const token = this.getToken();
            var userinfo = EncryptorDecryptor.decryptUsingAES256(this.jwtHelper.decodeToken<any>(token).userinfo);
            var userjson = JSON.parse(userinfo);
            return userjson.username;
        }
        else {
            return null
        }
    }

    getToken() {
        return localStorage.getItem("jwt");
    }

    isUserAuthenticated = (): boolean => {
        const token = this.getToken();
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            return true;
        }
        return false;
    }

    getRoles(params: any) {
        return this.httpClient.get<any[]>((ApiArea.controlpanel + ApiController.administration + "/GetApplicationRoles"), { responseType: "json", params: params }).pipe();
    }

    pageConfigInit(id: any, pageSize: number, currentPage: number, totalItems: number) {
        return {
            id: id,
            itemsPerPage: pageSize,
            currentPage: currentPage == 0 ? 1 : currentPage,
            totalItems: totalItems
        }
    }

    getuserprivileges(): any[] | null {
        if (this.isUserAuthenticated()) {
            const encryptprivileges = localStorage.getItem("userprivileges");
            const usermenu = EncryptorDecryptor.decryptUsingAES256(encryptprivileges);
            const userjson = (<any[]>JSON.parse(usermenu));
            return userjson;
        }
        return null;
    }

    encryptUsingAES256(encString) {
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(encString), AppConstants.key, {
            keySize: 128 / 8,
            iv: AppConstants.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // console.log('Encrypted :' + encrypted);
        // this.decryptUsingAES256(encrypted);
        return encrypted;
    }

    decryptUsingAES256(decString) {
        var decrypted = CryptoJS.AES.decrypt(decString, AppConstants.key, {
            keySize: 128 / 8,
            iv: AppConstants.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // console.log('Decrypted : ' + decrypted);
        // console.log('utf8 = ' + decrypted.toString(CryptoJS.enc.Utf8));
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    isUserInDefaultPassword(): boolean | null {
        if (this.isUserAuthenticated()) {
            const encryptDefaultPass = localStorage.getItem("x-site-session");
            //console.log("encryptDefaultPass >>>", encryptDefaultPass);
            if (encryptDefaultPass != null && encryptDefaultPass != undefined) {
                const userInDefault = EncryptorDecryptor.decryptUsingAES256(encryptDefaultPass);
                //console.log("userInDefault >>>", userInDefault);
                const passJson = (<any>JSON.parse(userInDefault));
                //console.log("passJson >>>", passJson);
                var isDefaultPass = passJson.isDefaultPassword;
                return isDefaultPass;
            }
        }
        return null;
    }

    getDefaultPassword() {
        const encryptDefaultPass = localStorage.getItem("x-site-session");
        const userInDefault = EncryptorDecryptor.decryptUsingAES256(encryptDefaultPass);
        const passJson = (<any>JSON.parse(userInDefault));
        var defaultCode = passJson.defaultCode;
        return defaultCode;
    }

    getPagePrivileges(componentName: any): null | {} {
        let items = this.getuserprivileges();
        let pagePrivileges = {};
        if (items != null && componentName != null && items != null) {
            for (const mainmenu of items) {
                let submenuList = <any[]>mainmenu.appUserSubmenus;
                for (const submenu of submenuList) {
                    if (submenu.component != null && submenu.component != ''
                        && submenu.component.toString().toLowerCase() == componentName.toString().toLowerCase()) {
                        let pagePrivileges = {
                            component: submenu.component,
                            add: submenu.add,
                            delete: submenu.delete,
                            detail: submenu.detail,
                            edit: submenu.edit,
                            hasTab: submenu.hasTab,
                            report: submenu.report,
                            upload: submenu.upload,
                            approval: submenu.approval,
                            accept: submenu.accept,
                            check: submenu.check,
                        }
                        //console.log('pagePrivileges >>>', pagePrivileges);
                        return pagePrivileges;
                    }
                    else {
                        let subsubmenusList = <any[]>submenu.appUserSubSubmenus;
                        if (subsubmenusList != null && subsubmenusList.length > 0) {
                            for (const subsub of subsubmenusList) {
                                if (subsub.component != null && subsub.component != ''
                                    && subsub.component.toString().toLowerCase() == componentName.toString().toLowerCase()) {
                                    //console.log("subsubmenusList >>>", subsubmenusList);
                                    let pagePrivileges = {
                                        component: subsub.component,
                                        add: subsub.add,
                                        delete: subsub.delete,
                                        detail: subsub.detail,
                                        edit: subsub.edit,
                                        hasTab: subsub.hasTab,
                                        report: subsub.report,
                                        upload: subsub.upload,
                                        approval: subsub.approval,
                                        accept: submenu.accept,
                                        check: submenu.check,
                                    }
                                    return pagePrivileges;
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    getPrivileges(): null | {} {
        if (localStorage.getItem("x-page-privileges") == null) {
            return null;
        }
        else {
            return JSON.parse(localStorage.getItem("x-page-privileges"));
        }
    }


}