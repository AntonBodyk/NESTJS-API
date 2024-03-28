import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TagModule } from "./tag/tag.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "@app/ormconfig";
import { UserModule } from "@app/user/user.module";
import { AuthMiddleware } from "@app/user/middlewares/auth.middleware";
import { ArticleModule } from "@app/article/article.module";
import { ProfileModule } from "@app/profile/profile.module";

@Module({
  imports: [TypeOrmModule.forRoot(config), TagModule, UserModule, ArticleModule, ProfileModule],            //ВСЕ МОДУЛИ КОТОРЫЕ БУДУТ СОЗДАНЫ, ДОЛЖНЫ РЕГИСТРИРОВАТЬСЯ ТУТ
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
