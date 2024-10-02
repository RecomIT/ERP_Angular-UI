import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EncryptorDecryptor } from '../services/encryptor-decryptor';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor(private userService: UserService, private deviceService: DeviceDetectorService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.userService.isUserAuthenticated()) {
      const access_token = this.userService.getToken();
      const Authorization = "Bearer " + access_token;
      const u_id = this.userService.User().UserId;
      const u_nm = this.userService.User().Username;
      const e_id = this.userService.User().EmployeeId?.toString();
      const b_id = this.userService.User().BranchId?.toString();
      const dv_id = this.userService.User().DivisionId?.toString();
      const c_id = this.userService.User().ComId?.toString();
      const o_id = this.userService.User().OrgId?.toString();
      const dp_id = this.userService.User().DepartmentId?.toString();
      const dg_id = this.userService.User().DesignationId?.toString();
      const r_id = this.userService.User().RoleId?.toString();
      const r_nm = this.userService.User().RoleName?.toString();

      var user_info = { "u_id": u_id, "u_nm": u_nm, "e_id": e_id, "b_id": b_id, "dv_id": dv_id, "c_id": c_id, "o_id": o_id, "dp_id": dp_id, "dg_id": dg_id, "r_id": r_id, "r_nm": r_nm};
  
      return next.handle(
        request.clone({
          setHeaders: { Authorization: Authorization, x_site_info: JSON.stringify(user_info), access_token: access_token, x_machine_info: JSON.stringify(this.deviceService.getDeviceInfo()) }
        }),
      );
    }
    return next.handle(request);
  }
}
