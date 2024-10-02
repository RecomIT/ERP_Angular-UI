import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceLengthService {

  constructor(
    private datePipe: DatePipe,
    private notifyService: NotifyService
  ) { }

  calculateServiceLength(dateOfJoining: Date): string {
    try {
      console.log('dateOfJoining', dateOfJoining);

      if (dateOfJoining) {
        const currentDate = new Date();
        const formattedDateOfJoining = this.datePipe.transform(dateOfJoining, 'yyyy-MM-dd');
        const formattedCurrentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

        if (formattedDateOfJoining && formattedCurrentDate) {
          const joinedDate = new Date(formattedDateOfJoining);
          const today = new Date(formattedCurrentDate);

          let yearsDifference = today.getFullYear() - joinedDate.getFullYear();
          let monthsDifference = today.getMonth() - joinedDate.getMonth();
          let daysDifference = today.getDate() - joinedDate.getDate();

          if (daysDifference < 0) {
            monthsDifference--;
            daysDifference += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
          }

          if (monthsDifference < 0) {
            yearsDifference--;
            monthsDifference += 12;
          }

          const yearString = yearsDifference > 0 ? `${yearsDifference} ${yearsDifference === 1 ? 'year' : 'years'}` : '';
          const monthString = monthsDifference > 0 ? `${monthsDifference} ${monthsDifference === 1 ? 'month' : 'months'}` : '';
          const dayString = daysDifference > 0 ? `${daysDifference} ${daysDifference === 1 ? 'day' : 'days'}` : '';

          return `${yearString} ${monthString} ${dayString}`;
        } else {
          throw new Error('Date format conversion failed');
        }
      } else {
        throw new Error('Date of joining not available');
      }
    } catch (error) {
      console.error(error);
      this.notifyService.showErrorToast('Error calculating service length', 'Error');
      return ''; // or handle error accordingly
    }
  }


  
}
