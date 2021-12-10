import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';
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
} from 'typeorm';
import addresses from './addresses';
import contacts from './contacts';
import posts from './posts';
import post_likes from './post_likes';
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
  @MinLength(6)
  password: string;

  @Column()
  image: string;

  @OneToMany(() => posts, (posts) => posts.user)
  posts: posts[];

  @OneToMany(() => post_likes, (postLikes) => postLikes.user)
  post_likes: post_likes;

  @OneToMany(() => user_followers, (user_followers) => user_followers)
  @JoinColumn({
    name: 'follower_id',
    referencedColumnName: 'id',
  })
  user_followers: user_followers[];

  @OneToOne(() => addresses, (address) => address.user)
  address: addresses;

  @OneToOne(() => contacts, (contact) => contact.user)
  contacts: contacts;
}
