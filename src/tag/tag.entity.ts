import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({name: 'tags'})             //Здесь можем указывать название таблицы, какое нам нужно
export class TagEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}