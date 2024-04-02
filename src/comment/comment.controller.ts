import { Body, Controller, Post, UseGuards, Get, Delete, Param } from "@nestjs/common";
import {AuthGuard} from "@app/user/guards/auth.guard";
import { UserDecorator } from "@app/user/decorators/user.decorator";
import { UserEntity } from "@app/user/user.entity";
import { CreateCommentDto } from "@app/comment/dto/CreateComment.dto";
import { CommentService } from "@app/comment/comment.service";
import { CommentResponseInterface } from "@app/comment/types/commentResponse.interface";
import { CommentEntity } from "@app/comment/comment.entity";


@Controller('articles')
export class CommentController {

  constructor(private readonly commentService: CommentService) {}
  @Post(':slug/comments')
  @UseGuards(AuthGuard)
  async newComment(@UserDecorator() currentUser: UserEntity, @Body('comment') createCommentDto: CreateCommentDto): Promise<CommentResponseInterface> {
    const comment = await this.commentService.newComment(currentUser, createCommentDto);
    return this.commentService.buildCommentResponse(comment);
  }

  @Get(':slug/comments')
  async getCommentsFromArticle(): Promise<CommentEntity[]>{
    return await this.commentService.getComments();
  }

  @Delete(':slug/comments/:id')
  @UseGuards(AuthGuard)
  async deleteComment(@UserDecorator('id') currentUserId: number, @Param('id') commentId: string){
    return await this.commentService.deleteComment(currentUserId, commentId);
  }
}