import { Body, Controller, Post, ValidationPipe, UsePipes } from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserResponseInterface } from "@app/types/userResponse.interface";

@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())     //проверяет body и проверяет то что передали createUserDto
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {    //с помощью декоратора body получаем данные , если указать ключ, то получим данные по ключу
      console.log('createUserDto', createUserDto);
     const user = await this.userService.createUser(createUserDto);
     return this.userService.buildUserResponse(user);
  }
}