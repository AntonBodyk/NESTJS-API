import { Body, Controller, Post, ValidationPipe, UsePipes, Get, UseGuards, Put } from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserResponseInterface } from "@app/user/types/userResponse.interface";
import { LoginUserDto } from "@app/user/dto/loginUser.dto";
import { UserDecorator } from "@app/user/decorators/user.decorator";
import { UserEntity } from "@app/user/user.entity";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UpdateUserDto } from "@app/user/dto/updateUser.dto";

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

  @Get('user')
  @UseGuards(AuthGuard)       //проверяет зареган ли пользователь ! теперь все чотко и тут всегда будет зарегистрированній пользователь
  async getCurrentUser(@UserDecorator() user: UserEntity ): Promise<UserResponseInterface> {
      return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(@UserDecorator('id') currentUserId: number, @Body('user') updateUserDto: UpdateUserDto ): Promise<UserResponseInterface> {
      const user = await this.userService.updateUser(currentUserId, updateUserDto);   //обновляет пользователя по id
      return this.userService.buildUserResponse(user);
  }
}