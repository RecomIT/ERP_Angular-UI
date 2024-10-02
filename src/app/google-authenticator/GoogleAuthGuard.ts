import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const isGoogleAuthCompleted = this.isGoogleAuthCompleted();
    console.log('GoogleAuthGuard: Checking if Google Auth is completed:', isGoogleAuthCompleted);

    if (!isGoogleAuthCompleted) {
      console.log('GoogleAuthGuard: Google Auth not completed. Redirecting to /google-authenticator');
      this.router.navigate(['/google-authenticator']);
      return false;
    }
    console.log('GoogleAuthGuard: Google Auth completed. Access granted.');
    return true;
  }

  private isGoogleAuthCompleted(): boolean {
    const googleAuthCompleted = localStorage.getItem('googleAuthCompleted');
    console.log('GoogleAuthGuard: Value of googleAuthCompleted from localStorage:', googleAuthCompleted);
    return googleAuthCompleted === 'true';
  }
}
