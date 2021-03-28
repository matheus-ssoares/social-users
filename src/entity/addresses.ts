import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import User from "./User";

@Entity({ name: "addresses" })
export default class addresses {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    address_title: string;

    @Column()
    country: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column()
    neighborhood: string;

    @Column()
    zip_code: string;

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

