import { Module } from "@nestjs/common";
import { UserController } from "@app/user/user.controller";
import { UserService } from "@app/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]        //то что сюда добавим будет доступно где-то еще!
})
export class UserModule {

}