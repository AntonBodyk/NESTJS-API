import { BeforeInsert, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import {hash} from 'bcrypt';
import { ArticleEntity } from "@app/article/article.entity";
import { CommentEntity } from "@app/comment/comment.entity";

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

  @Column({select: false})    //Важная сущность которая исключает из всех запросов пароль, так как не нужно его возвращать на клиент !!!
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

  @OneToMany(() => ArticleEntity, (article) => article.author)    //Пример взаимосвязи один ко многим между юзером и статьями !!!
  articles: ArticleEntity[];

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];
}