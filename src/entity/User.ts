import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import addresses from './addresses';
import contacts from './contacts';
import posts from './posts';
import user_followers from './user_followers';

export enum Gender {
  M = 'M',
  F = 'F',
}
@Entity({ name: 'users' })
@Unique('UNIQUE_USER_EMAIL_CONSTRAINT', ['email'])
export default class users {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  birth_date: string;

  @Column()
  biography: string;

  @Column()
  @IsNotEmpty()
  /*  @IsIn(['F', 'M']) */
  gender: Gender;

  @Column()
  token_version: number;

  @Column()
  refresh_token_version: number;

  @Column()
  reset_password_token: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @Column()
  image: string;

  @OneToMany(() => posts, (posts) => posts.user)
  posts: posts[];

  @OneToMany(() => user_followers, (user_followers) => user_followers.follower)
  following: user_followers[];

  @OneToMany(() => user_followers, (user_followers) => user_followers.user)
  user_followers: user_followers[];

  @OneToOne(() => addresses, (address) => address.user)
  address: addresses;

  @OneToOne(() => contacts, (contact) => contact.user)
  contacts: contacts;
}
