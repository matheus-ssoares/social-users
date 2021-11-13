import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import posts from './posts';

@Entity({ name: 'post_images' })
export default class post_images {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  image: string;

  @Column({ name: 'post_id' })
  post_id: string;

  @ManyToOne(() => posts, (posts) => posts.post_images)
  @JoinColumn({
    name: 'post_id',
    referencedColumnName: 'id',
  })
  posts: posts;
}
