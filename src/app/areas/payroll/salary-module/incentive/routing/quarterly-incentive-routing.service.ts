import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class QuarterlyIncentiveRoutingService {

  constructor(
    private areasHttpService: AreasHttpService
  ) { }


  routePrefix = 'Salary/Incentive';
  controllerName = 'QuarterlyIncentive';
  actionName: string;

    
  downloadExcelFormat<T>(fileName: string): Observable<T> {
    this.actionName = 'QuarterlyIncentiveExcelFormatDownload';

    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: { fileName: fileName },
        responseType: 'arraybuffer' 
      }
    );
  }



  uploadExcel(formData: FormData): Observable<any> {
    this.actionName = 'UploadQuarterlyIncentiveExcel';
    const urlEndpoint = `${ApiArea.payroll}/${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_post(urlEndpoint, formData, {});
  }
  

  getBatchNo<T>(params: any | null): Observable<T> {
    this.actionName = 'GetBatchNo';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }




  
  getQuarterlyIncenitveYear<T>(params: any | null): Observable<T> {
    this.actionName = 'GetQuarterlyIncenitveYear';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }




  
  getQuarterlyIncentiveQuarter<T>(params: any | null): Observable<T> {
    this.actionName = 'GetQuarterlyIncenitveQuarter';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }



  
  getQuarterlyIncentiveEmployees<T>(params: any | null): Observable<T> {
    this.actionName = 'GetQuarterlyIncenitveEmployees';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }


  
  getQuarterlyIncentive<T>(params: any | null): Observable<T> {
    this.actionName = 'GetQuarterlyIncentive';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }




  getQuarterlyIncentiveReport<T>(params: any | null): Observable<T> {
    this.actionName = 'QuarterlyIncentiveReport'; 

    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
        {
            params: params,
            responseType: 'blob' 
        }
    );
  }




  
  getQuarterlyIncentiveDeails<T>(params: any | null): Observable<T> {
    this.actionName = 'GetQuarterlyIncentiveDetail';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }




  
  updateQuarterlyIncentiveDetail<T>(params: any | null): Observable<T> {
    this.actionName = 'UpdateQuarterlyIncentiveDetail';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }



  
  deleteQuarterlyIncentiveProcess<T>(params: any | null): Observable<T> {
    this.actionName = 'DeleteQuarterlyIncentiveProcess';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }





  
  
  undoOrDisbursedQuarterlyIncentiveProcess<T>(params: any | null): Observable<T> {
    this.actionName = 'UndoOrDisbursedQuarterlyIncentiveProcess';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }







  
  getQuarterlyIncenticeExcelReport<T>(params: any | null): Observable<T> {
    this.actionName = 'GetQuarterlyIncenticeExcelReport';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }


  
  

  getQuarterlyIncentiveExcelReport<T>(params: any | null): Observable<T> {
    this.actionName = 'GetQuarterlyIncenticeExcelReport'; 

    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.payroll}/${urlEndpoint}`,
        {
            params: params,
            responseType: 'blob' 
        }
    );
  }


}
