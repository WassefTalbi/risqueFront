import { Component,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CountUpModule} from "ngx-countup";
import {UserProfileService} from "../../../core/services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import { User } from 'src/app/store/Authentication/auth.models';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { chatMessagesData } from '../../forms/advance/data';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'

})
export class UsersComponent {
  users: any;
  breadCrumbItems!: Array<{}>;
  usersWithImages: any[] = [];
  signupForm!: UntypedFormGroup;
  submitted = false;
  successmsg = false;
  error = '';
  emailError = '';
  passwordError = '';
  firstNameError = '';
  lastNameError = '';
  searchTerm: string = '';
  fieldTextType!: boolean;
  fileChefProjet: File | null = null;

  @ViewChild('addUserModal', { static: false }) addUserModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  deleteId: any;
  constructor(private userService: UserProfileService,
              private sanitizer: DomSanitizer,private formBuilder: UntypedFormBuilder, private authService:AuthenticationService,
              private router: Router) { }

ngOnInit(): void {
  this.signupForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(22)]],
    mobileNumber: ['', [Validators.pattern('\\d{8}')]],
    email: ['', [Validators.required, Validators.email]],
    photoProfile: [null, Validators.required], 
  });
 
  this.breadCrumbItems = [{ label: 'Custom UI' }, { label: 'Profile', active: true }];
  this.loadAllUsers()
}

  loadAllUsers(){
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
      this.users.forEach((user: User) => {
        this.getImage(user);
      });
    });
  }
  getImage(user: User) {
  if (user.photoProfile !== undefined) {
    this.userService.getImage(user.photoProfile).subscribe(data => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        // Add the image to the user object
        user.imageToShow = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        this.usersWithImages.push(user);
      }, false);

      if (data) {
        reader.readAsDataURL(data);
      }
    }, error => {
      console.log(error);
    });
  } else {
    console.log('photoProfile is undefined for user:', user);
  }
}
  blockUser(id: number): void {
    console.log("aaaaa")
    this.userService.blockUser(id).subscribe((response) => {
      console.log(response)

      const user = this.users.find((user: any) => user.id === id);
      console.log(user.nonLocked)
      if (user) {
        user.nonLocked = false;
      }
    }, error => {
      // Log the error to the console
      console.error('Error unblocking user:', error);
    });
  }

  unblockUser(id: number): void {
    this.userService.unblockUser(id).subscribe((response) => {
      console.log(response)
      const user = this.users.find((user: any) => user.id === id);
      console.log(user.nonLocked)
      if (user) {
        user.nonLocked = true;
      }
    }, error => {
      // Log the error to the console
      console.error('Error unblocking user:', error);
    });
  }

  get f() { return this.signupForm.controls; }
  get password() { return this.signupForm.get('password'); }

  hasLowercase() {
    const pattern = /(?=.*[a-z])/;
    return this.password?.hasError('pattern') && !pattern.test(this.password.value);
  }

  hasUppercase() {
    const pattern = /(?=.*[A-Z])/;
    return this.password?.hasError('pattern') && !pattern.test(this.password.value);
  }

  hasNumber() {
    const pattern = /(?=.*\d)/;
    return this.password?.hasError('pattern') && !pattern.test(this.password.value);
  }

  hasMinLength() {
    return this.password?.hasError('minlength');
  }
  Default = chatMessagesData;
  selectedCountry = this.Default[228]; // Default selected country
  filterCountries(): void {
    this.Default = this.originalCountries.filter(country =>
      country.countryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      country.countryCode.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  originalCountries = [...chatMessagesData];
  selectValue(data: any) {
    this.selectedCountry = data;
  }
  onSearchChange(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchTerm = searchValue;
    this.filterCountries();
  }

  onChangeChefProjet(event: any) {
    this.fileChefProjet = event.target.files[0];
  }

  onSubmit() {
    console.log("test",this.signupForm.valid);
    
  
    const fmobileNumber = this.f['mobileNumber'].value;
    let countryCode = this.selectedCountry.countryCode;
    let mobileNumber = `${countryCode} ${fmobileNumber}`;
    const firstName = this.f['firstName'].value;
    const lastName = this.f['lastName'].value;
    const email = this.f['email'].value;
    const password = this.f['password'].value;
    const registerData = new FormData();
      registerData.append('firstName', firstName);
      registerData.append('lastName', lastName);
      registerData.append('password', password);
      registerData.append('mobileNumber', mobileNumber);
      registerData.append('email', email);
      if (this.fileChefProjet) {
        registerData.append('photoProfile', this.fileChefProjet);
      }
    // Call AuthService method to register user
    this.authService.registerUser(registerData).subscribe(
      (response) => {
        this.router.navigate(['/auth/login']);
        console.log('User registered successfully:', response);
      },
      (error) => {
        if (error.status === 400) {
          if (error.error.firstName || error.error.lastName || error.error.password || error.error.email) {
            this.firstNameError = error.error.firstName;
            this.lastNameError = error.error.lastName;
            this.passwordError = error.error.password;
             this.emailError = error.error.email;
             console.log(error.error.email)
               }
        } else if(error.status === 500){
          if (error.error.error === 'Email already exists') {
            this.emailError = 'Email already exists';
          }else {
            console.log('An unexpected error occurred:', error);
          }
        } else {
          console.log('An unexpected error occurred:', error);
        }
      }
    );
  
    
  }

  removeUser(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show()
  }


  deleteUser() {
    this.userService.removeUser(this.deleteId).subscribe(data=>{
      this.loadAllUsers();
      this.removeItemModal?.hide()
    },error=>{
      console.log(error)
    });
  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
