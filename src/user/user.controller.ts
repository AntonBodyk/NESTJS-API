import { Body, Controller, Post, ValidationPipe, UsePipes, Get } from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserResponseInterface } from "@app/types/userResponse.interface";
import { LoginUserDto } from "@app/user/dto/loginUser.dto";

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

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
    const loginUser = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(loginUser);
  }
}