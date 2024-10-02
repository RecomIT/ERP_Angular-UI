import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResignationCategoryRoutingService } from '../../routing-service/category-subcategory/resignation-category-routing.service';

@Injectable({
  providedIn: 'root'
})
export class ResignationCategoryService {

  private resignationCategories: any[] = [];

  constructor(private resignationCategoryRoutingService: ResignationCategoryRoutingService) { }

  fetchResignationCategories(): Observable<any[]> {
    return this.resignationCategoryRoutingService.getResignationCategoryApi<any[]>(null);
  }

  getResignationCategories(): Observable<any[]> {
    if (this.resignationCategories.length === 0) {
      return this.fetchResignationCategories();
    } else {
      return new Observable(observer => {
        observer.next(this.resignationCategories);
        observer.complete();
      });
    }
  }





  private resignationSubCategories: any[] = [];
  
  fetchResignationSubCategories(params: any): Observable<any[]> {
    return this.resignationCategoryRoutingService.getResignationSubCategoryApi<any[]>(params);
  }

  getResignationSubCategories(params: any): Observable<any[]> {
    if (this.resignationSubCategories.length === 0) {
      return this.fetchResignationSubCategories(params);
    } else {
      return new Observable(observer => {
        observer.next(this.resignationSubCategories);
        observer.complete();
      });
    }
  }

}
