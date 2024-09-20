import {SafeUrl} from "@angular/platform-browser";

export class User {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoProfile?: string;
  nonLocked?: string;
  email?: string;
  token?:string;
  imageToShow?: SafeUrl;  // Add this line


}



