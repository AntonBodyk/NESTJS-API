import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TagModule} from "./tag/tag.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import config from "@app/ormconfig";
import { UserModule } from "@app/user/user.module";

@Module({
  imports: [TypeOrmModule.forRoot(config), TagModule, UserModule],            //ВСЕ МОДУЛИ КОТОРЫЕ БУДУТ СОЗДАНЫ, ДОЛЖНЫ РЕГИСТРИРОВАТЬСЯ ТУТ
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
