import { Component } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {AuthenticationService} from "../../../core/services/auth.service";
import {UserProfileService} from "../../../core/services/user.service";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {GlobalComponent} from "../../../global-component";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})

// Profile Setting component
export class ProfileSettingsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  fieldTextType!: boolean;
  fieldTextType1!: boolean;
  fieldTextType2!: boolean;
  bsConfig?: Partial<BsDatepickerConfig>;

  formGroups: FormGroup[] = [];
  educationForm!: FormGroup;
  currentTab = 'personalDetails';
  photoProfile!: string;
  currentUser:any;
  constructor(private formBuilder: FormBuilder, private authService:AuthenticationService,private userService:UserProfileService, private sanitizer: DomSanitizer) { }
  imageToShow: any;
  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Pages', active: true },
      { label: 'Profile Settings', active: true }
    ];
   this.getImage()


    this.educationForm = this.formBuilder.group({
      degree: [''],
      name: [''],
      year: [''],
      to: [''],
      description: ['']
    });
    this.formGroups.push(this.educationForm);

  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  /**
  * Default Select2
  */
  selectedAccount = 'This is a placeholder';
  Skills = [
    { name: 'Illustrator' },
    { name: 'Photoshop' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Javascript' },
    { name: 'Python' },
    { name: 'PHP' },
  ];
  getImage() {
    this.userService.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        console.log("&&&&&&&&&&&");
        console.log(this.currentUser.photoProfile);

        // Call getImage inside the subscribe block of getCurrentUser
        this.userService.getImage(this.currentUser.photoProfile).subscribe(data => {
          this.createImageFromBlob(data);
        }, error => {
          console.log(error);
        });
      },
      error => {
        console.error('Errorrrrrr:', error);
      }
    );
  }
  // Change Tab Content
  changeTab(tab: string) {
    this.currentTab = tab;
  }

  // File Upload
  imageURL: any;
  fileChange(event: any, id: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      if (id == '0') {
        document.querySelectorAll('#cover-img').forEach((element: any) => {
          element.src = this.imageURL;

        });
      }
      if (id == '1') {
        document.querySelectorAll('#user-img').forEach((element: any) => {
          element.src = this.imageURL;
        });
      }
    }

    reader.readAsDataURL(file)
  }
onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    this.userService.uploadProfilePicture(file, this.authService.currentUser()['sub']).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Response:
            console.log(event.body);
            this.getImage()
            this.imageURL = event.body.url;
            break;
          default:
            break;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}


// When the user logs in or updates their profile picture, you update userProfileImageUrl
// For example, in a method that handles the response from the server when the user logs in:
  handleLoginResponse(response: any) {
    // ... other code to handle the login response ...

    // Update userProfileImageUrl with the URL of the user's profile picture
    this.photoProfile = response.user.photoProfile;
  }
  /**
  * Password Hide/Show
  */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1
  }
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

   // add Form
   addForm() {
    const formGroupClone = this.formBuilder.group(this.educationForm.value);
    this.formGroups.push(formGroupClone);
  }

  // Delete Form
  deleteForm(id: any) {
    this.formGroups.splice(id, 1)
  }

}


