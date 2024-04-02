import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "@app/user/user.entity";


@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment_text: string;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamp(){
    this.updated_at = new Date();
  }

  @ManyToOne(() => UserEntity, (user) => user.comments, {eager: true})    //eager - всегда будем загружать автора вместе с данными статьи!
  author: UserEntity
}