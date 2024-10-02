import { Observable, throwError } from "rxjs";
import { BaseHttpService } from "../shared/http-service/http.base.service";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ApiUrl, AppConstants, ImageUrl } from "../shared/constants";
import { catchError } from "rxjs/operators";
import { ValidationError } from "src/models/validation-error-model";

@Injectable({
    providedIn: 'root'
})

export class AreasHttpService implements BaseHttpService {

    apiURL: string = AppConstants.app_environment == "Local" ? ApiUrl.Local : ApiUrl.Hris;
    imageURL: string = AppConstants.app_environment == "Local" ? ImageUrl.Local : ImageUrl.Hris;

    apiRoot: string = AppConstants.app_environment == "Local" ? ApiUrl.Local :
        (AppConstants.app_environment == "Public" ? this.apiURL : "");

    imageRoot: string = AppConstants.app_environment == "Local" ? this.imageURL :ImageUrl.Hris;

    constructor(private httpClient: HttpClient) { }
    
    observable_get_by_url<T>(url: string, httpOptions: {}): Observable<T> {
        return this.httpClient.get<T>(`${url}`, httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }
    observable_get<T>(url: string, httpOptions: {}): Observable<T> {
        return this.httpClient.get<T>(`${this.apiRoot}${url}`, httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }
    observable_post<T>(url: string, data: any, httpOptions: {}): Observable<T> {
        return this.httpClient.post<T>(`${this.apiRoot}${url}`, data, httpOptions).pipe(
            catchError(this.handleError)
        );;
    }
    observable_put<T>(url: string, data: any, httpOptions: {}): Observable<T> {
        return this.httpClient.put<T>(`${this.apiRoot}${url}`, data, httpOptions).pipe(
            catchError(this.handleError)
        );
    }
    observable_delete<T>(url: string, httpOptions: {}): Observable<T> {
        return this.httpClient.delete<T>(`${this.apiRoot}${url}`, httpOptions).pipe(
            catchError(this.handleError)
        );
    }
    observable_delete_data<T>(url: string, httpOptions: {}): Observable<T> {
        return this.httpClient.request<T>("delete", `${this.apiRoot}${url}`, httpOptions).pipe(
            catchError(this.handleError)
        );
    }
    promise_get<T>(url: string, httpOptions: {}): Promise<T> {
        return this.httpClient.get<T>(`${this.apiRoot}${url}`, httpOptions).toPromise();
    }
    promise_post<T>(url: string, data: any, httpOptions: {}): Promise<T> {
        return this.httpClient.post<T>(`${this.apiRoot}${url}`, data, httpOptions).toPromise();
    }
    promise_put<T>(url: string, data: any, httpOptions: {}): Promise<T> {
        return this.httpClient.put<T>(`${this.apiRoot}${url}`, data, httpOptions).toPromise();
    }
    promise_delete<T>(url: string, httpOptions: {}): Promise<T> {
        return this.httpClient.delete<T>(`${this.apiRoot}${url}`, httpOptions).toPromise();
    }
    private handleError(httpError: HttpErrorResponse) {
        var error = { msg: '', status: httpError?.status, havingValidationError: false, validationErrors: new ValidationError() };
        if (httpError.status == 0) {
            error.msg = httpError?.error;
        }
        else if (httpError.status == 404) {
            error.msg = httpError?.error;
        }
        else if (httpError.status == 401) {
            error.msg = httpError?.error;
        }
        else if (httpError.status == 501) {
            error.msg = httpError?.error;
        }
        else {
            error.msg = httpError.error;
            if (httpError.error?.title == 'One or more validation errors occurred.') {
                var errorResponse: ValidationError = httpError.error;
                error.havingValidationError = true;
                error.validationErrors = errorResponse.errors;
            }
        }
        return throwError(error);
    }

    private reject(error: any) {
        console.log('Promise Error');
    }
}