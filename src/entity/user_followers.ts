import { IsEmail, IsIn, IsNotEmpty, MinLength, IsUUID } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
  Unique,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import addresses from './addresses';

import post_likes from './post_likes';
import users from './User';

@Entity({ name: 'user_followers' })
export default class user_followers {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsNotEmpty()
  @IsUUID()
  follower_id: string;

  @Column()
  @IsUUID()
  user_id: string;

  @OneToOne(() => users, (users) => users.user_followers)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  follower: users;

  @OneToOne(() => users, (users) => users.user_followers)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: users;
}
