import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "@app/user/user.entity";


@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  slug: string

  @Column()
  title: string

  @Column({default: ''})
  description: string

  @Column({default: ''})
  body: string

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updated_at: Date;

  @Column('simple-array')
  tagList: string[]

  @Column({default: 0})
  favoritesCount: number

  @BeforeUpdate()
  updateTimestamp(){            //НУЖНО ТАК КАК ПРИ ОБНОВЛЕНИИ САМО ПОЛЕ НЕ ОБНОВИТСЯ!!!
    this.updated_at = new Date();
  }

  @ManyToOne(() => UserEntity, (user) => user.articles, {eager: true})    //eager - всегда будем загружать автора вместе с данными статьи!
  author: UserEntity
}