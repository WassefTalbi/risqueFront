import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AuthenticationService} from "../../../core/services/auth.service";
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-twostep',
  templateUrl: './twostep.component.html',
  styleUrls: ['./twostep.component.scss']
})

// Two step component
export class TwostepComponent implements OnInit {
  // set the currenr year
  year: number = new Date().getFullYear();

  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '80px',
      'height': '50px'
    }
  };


  errorMessage: string = '';
  email: string = '';
  code = new FormControl('');

  constructor(private route: ActivatedRoute,private authService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    console.log(this.route.queryParams)
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });

    console.log(this.code.value);
  }

  handleOtpChange(otp: string) {
    this.code.setValue(otp);
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.code.value !== null) {
      console.log(this.code.value);
      this.authService.verifyCode(this.code.value).subscribe(
        data => {
          console.log(data);
          let navigationExtras: NavigationExtras = {
            queryParams: {
              'token': this.code.value
            }
          };
          this.router.navigate(['auth/pass-change'], navigationExtras);
        },
      error => {

          this.errorMessage = 'Code is incorrect';
          console.log(error.status);

          console.log('yassin');
      }
      );
    }
  }
}
