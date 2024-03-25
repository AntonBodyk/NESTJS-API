import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {hash} from 'bcrypt';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({default: ''})       //Внутри колонок можем указывать дефолт значения данных
  bio: string;

  @Column({default: ''})
  img: string;

  @Column()
  password: string;


  @BeforeInsert()
  async hashPassword() {        //используем для хэширования пароля
    if (this.password) {
      console.log('Received password:', this.password);
      this.password = await hash(this.password, 10);
    } else {
      console.log('No password received');
    }
  }
}