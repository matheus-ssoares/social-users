import { IsEmail } from 'class-validator';
import { Gender } from '../entity/User';

export class UserRegister {
  name: string;

  email: string;
  document: string;
  birth_date: string;
  gender: Gender;
  password: string;
  image: string;
  address_title: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  zip_code: string;
  contact_name: string;
  phone: string;
}
