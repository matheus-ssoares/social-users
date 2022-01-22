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

import contacts from './contacts';
import post_comments from './post_comments';
import post_images from './post_images';
import post_likes from './post_likes';
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

  @OneToMany(() => post_images, (post_images) => post_images.posts)
  post_images: post_images[];

  @OneToMany(() => post_likes, (postLikes) => postLikes.posts)
  post_likes: post_likes[];

  @OneToMany(() => post_comments, (post_comments) => post_comments.posts)
  post_comments: post_comments[];

  @ManyToOne(() => users, (users) => users.posts)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: users;
}
