import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CommentEntity } from "@app/comment/comment.entity";
import { CommentResponseInterface } from "@app/comment/types/commentResponse.interface";
import { UserEntity } from "@app/user/user.entity";
import { CreateCommentDto } from "@app/comment/dto/CreateComment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";


@Injectable()
export class CommentService {

  constructor(@InjectRepository(CommentEntity)
              private readonly commentRepository: Repository<CommentEntity>) {}


  buildCommentResponse(comment: CommentEntity): CommentResponseInterface {
    return { comment: comment };
  }


  async newComment(currentUser: UserEntity, createCommentDto: CreateCommentDto): Promise<CommentEntity> {
    const newComment = new CommentEntity();
    Object.assign(newComment, createCommentDto);

    newComment.author = currentUser;

    return await this.commentRepository.save(newComment);
  }

  async getComments(): Promise<CommentEntity[]> {
      return await this.commentRepository.find();
  }

  async findCommentById(commentId: number): Promise<CommentEntity> {
    return await this.commentRepository.findOne({
      where: {
        id: commentId
      }
    })
  }

  async deleteComment(currentUserId: number, commentId: string): Promise<DeleteResult>{
    const id = parseInt(commentId);
    const comment = await this.findCommentById(id);

    if(!comment){
      throw new HttpException('comment does not exist', HttpStatus.NOT_FOUND);
    }

    if(comment.author.id !== currentUserId){
      throw new HttpException('Чмо, ты не автор, не удаляй!', HttpStatus.FORBIDDEN);
    }

    return await this.commentRepository.delete({id});
  }
}