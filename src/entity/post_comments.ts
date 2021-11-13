import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import contacts from './contacts';
import posts from './posts';
import users from './User';

@Entity({ name: 'post_comments' })
export default class post_comments {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsNotEmpty()
  post_id: string;

  @Column()
  user_id: string;

  @Column()
  @IsNotEmpty()
  comment: string;

  @ManyToOne(() => posts, (posts) => posts.post_likes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'post_id',
    referencedColumnName: 'id',
  })
  posts: posts;

  @ManyToOne(() => users, (users) => users.post_likes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: users;
}
