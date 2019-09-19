import { User } from "firebase";

export interface UserProfile extends User {
  address: string;
  city: string;
  zipcode: string;
  phoneNumber: string;
  role: string;
}
