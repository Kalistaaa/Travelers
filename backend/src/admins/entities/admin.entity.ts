import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('admins')
export class Admin {
    @PrimaryColumn({length: 255})
    adminsemail: string;

    @Column({length: 255})
    adminspass: string;

    @Column({length: 255})
    adminsname: string;

    @Column('date')
    adminsbirthday: Date;

    @Column({length: 255})
    adminsgender: string;

    @Column('date')
    adminscreated: Date;

    @Column({length: 255})
    adminsphone: string;

    @Column({length: 255})
    adminsnation: string;

    @Column({length: 255})
    adminsaddress: string;

    @Column({length: 255})
    adminspath: string;
}
