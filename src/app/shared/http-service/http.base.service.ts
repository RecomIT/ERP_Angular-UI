import { Observable } from "rxjs";

export interface BaseHttpService{
    observable_get(url:string,httpOptions:{}):Observable<object>;
    promise_get<T>(url:string,httpOptions:{}):Promise<T>;
    observable_post(url:string,data:any,httpOptions:{}):Observable<object>;
    promise_post(url:string,data:any,httpOptions:{}):Promise<object>;
    observable_put(url:string,data:any,httpOptions:{}):Observable<object>;
    promise_put(url:string,data:any,httpOptions:{}):Promise<object>;
    observable_delete(url:string,httpOptions:{}):Observable<object>;
    observable_delete_data(url:string,httpOptions:{}):Observable<object>;
    promise_delete(url:string,httpOptions:{}):Promise<object>;
}