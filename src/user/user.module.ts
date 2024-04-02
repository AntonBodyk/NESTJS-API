import { Module } from "@nestjs/common";
import { UserController } from "@app/user/user.controller";
import { UserService } from "@app/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { CommentEntity } from "@app/comment/comment.entity";
import { ArticleEntity } from "@app/article/article.entity";


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CommentEntity, ArticleEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService]        //то что сюда добавим будет доступно где-то еще!
})
export class UserModule {

}