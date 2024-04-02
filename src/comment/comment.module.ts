import { Module } from '@nestjs/common';
import { CommentController } from "@app/comment/comment.controller";
import { CommentService } from "@app/comment/comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "@app/comment/comment.entity";
import { UserEntity } from "@app/user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
