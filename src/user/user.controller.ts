import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserEntity } from "@app/user/user.entity";

@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {
  }
  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserEntity> {    //с помощью декоратора body получаем данные , если указать ключ, то получим данные по ключу
    return this.userService.createUser(createUserDto);
  }
}