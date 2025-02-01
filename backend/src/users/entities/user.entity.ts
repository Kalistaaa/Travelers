import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryColumn({length: 255})
    usersemail: string;

    @Column({length: 255})
    usersname: string;

    @Column({length: 255})
    userspass: string;

    @Column('date')
    usersbirthday: Date;

    @Column({length: 255})
    usersgender: string;

    @Column('date')
    userscreated: Date;

    @Column({length: 255})
    usersphone: string;

    @Column({length: 255})
    usersnation: string;

    @Column({length: 255})
    usersaddress: string;

    @Column({length: 255})
    userspath: string;

    @Column('boolean')
    userschange: boolean;

    @Column('boolean')
    usersisactive: boolean;

    @Column('boolean')
    userstwoverify: boolean;
}
