import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';

import users from './User';

@Entity({ name: 'posts' })
export default class posts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsNotEmpty()
  content: string;

  @Column()
  image: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  user_id: string;

  @ManyToOne(() => users, (users) => users.posts)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: users;
}
