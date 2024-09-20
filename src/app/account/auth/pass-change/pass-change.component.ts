import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-pass-change',
  templateUrl: './pass-change.component.html',
  styleUrls: ['./pass-change.component.scss']
})

// Password Chage Component
export class PassChangeComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  token: string = '';
  fieldTextType!: boolean;
  fieldTextType1!: boolean;
  errorMessage: string = '';
  /**
 * Password Hide/Show
 */
  ngOnInit() {
    this.fieldTextType = true;
    this.fieldTextType1 = true;
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }

  password: string = '';
  confirmPassword: string = '';

  constructor(private route: ActivatedRoute,private authService: AuthenticationService, private router: Router) { }

  onSubmit() {
    // Retrieve the token from the component's state
    let token = this.token;

    this.errorMessage = '';
    // Call the resetPassword method and pass the token, password, and confirmPassword
    this.authService.resetPassword(token, this.password, this.confirmPassword).subscribe(
      data => {
        this.router.navigate(['/auth/login']);
      },
      error => {
        if (error.error.error ==='An unexpected error occurred' ) {
          this.errorMessage = 'Password and Confirm Password do not match';
          console.log(error.status);
        } else     if (error.error.error === 'Password must contain at least one lowercase letter, one uppercase letter, and one number.' ) {
          this.errorMessage = error.error.error;
          console.log(error.status);
        }
      }
    );
      }

}

