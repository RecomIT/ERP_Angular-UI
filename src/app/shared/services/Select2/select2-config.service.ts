import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Select2ConfigService {

  constructor() { }

  private defaultConfig: any = {
    width: '100%',
    containerCssClass: 'form-control form-control-sm text-x-small',
    theme: 'bootstrap4'
  };

  getDefaultConfig(customConfig: any = {}): any {
    return { ...this.defaultConfig, ...customConfig };
  }
}
