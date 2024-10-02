import { TimepickerConfig } from "ngx-bootstrap/timepicker";

export function getTimepickerConfig(): TimepickerConfig {
    return Object.assign(new TimepickerConfig(), {
      hourStep: 1,
      minuteStep: 1,
      showMeridian: false,
      readonlyInput: false,
      mousewheel: true,
      showMinutes: true,
      showSeconds: false,
      labelHours: 'Hours',
      labelMinutes: 'Minutes',
      labelSeconds: 'Seconds'
    });
  }