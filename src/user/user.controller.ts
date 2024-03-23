import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import { CreateUserDto } from "@app/user/dto/createUser.dto";

@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {
  }
  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<string> {    //с помощью декоратора body получаем данные , если указать ключ, то получим данные по ключу
    console.log('createUserDto', createUserDto)
    return this.userService.createUser(createUserDto);
  }
}