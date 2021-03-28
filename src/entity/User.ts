import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import addresses from "./addresses";
import contacts from "./contacts";

@Entity({ name: "users" })
export default class users {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    document: string;

    @Column()
    birth_date: string;

    @Column()
    gender: string;

    @Column()
    password: string;

    @Column()
    image: string;

    @OneToOne(() => addresses, (address) => address.user)
    address: addresses;

    @OneToOne(() => contacts, (contact) => contact.user)
    contacts: contacts;


}
