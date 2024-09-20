import { User } from 'src/app/store/Authentication/auth.models';
export class Model {
  id: number;
  name: string;
  url: string;
  image: string;
  users: User[]; // replace with User model if it exists

  constructor(id: number, name: string, url: string, image: string, users: User[]) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.image = image;
    this.users = users;
  }
}
