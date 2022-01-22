import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity({ name: 'contacts' })
export default class contacts {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  contact_name: string;

  @Column()
  @IsNotEmpty()
  phone: string;

  @Column()
  user_id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.address)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
