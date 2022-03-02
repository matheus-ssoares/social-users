import { IsNotEmpty, MinLength, IsUUID } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from 'typeorm';

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
  user_id: string;

  @ManyToOne(() => users, (users) => users.user_followers)
  @JoinColumn({ name: 'follower_id', referencedColumnName: 'id' })
  follower: users;

  @ManyToOne(() => users, (users) => users.following)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: users;
}
