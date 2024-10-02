import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatePickerConfigService {

  getConfig(customConfig: any = {}) {
    const defaultConfig = {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left"
    };

    return { ...defaultConfig, ...customConfig };
  }

  getRangeConfig(customConfig: any = {}) {
    const defaultConfig = {
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
      customTodayClass: 'custom-today-class'
    };

    return { ...defaultConfig, ...customConfig };
  }
}
