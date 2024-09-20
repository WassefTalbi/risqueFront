import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "../services/auth.service";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class userGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate(): boolean {
    // Check if the user is an admin (Implement your own logic here)
    const isUser = this.authService.isUser(); // Assuming you have a method in AuthService to check if the user is an admin

    if (isUser) {
      return true; // Allow navigation to the dashboard
    } else {
      this.router.navigate(['/auth/login']); // Redirect to login page if not an admin
      return false;
    }
  }
}
