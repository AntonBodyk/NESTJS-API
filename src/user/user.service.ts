import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserEntity } from "@app/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {sign} from 'jsonwebtoken';
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "@app/user/types/userResponse.interface";
import { LoginUserDto } from "@app/user/dto/loginUser.dto";
import {compare} from "bcrypt";
import { UpdateUserDto } from "@app/user/dto/updateUser.dto";

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: {email: createUserDto.email},
    });
    const userByName = await this.userRepository.findOne({
      where: {username: createUserDto.username},
    });

    if(userByEmail || userByName){
      throw new HttpException('Такой email или имя пользователя уже существуют', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    this.logger.debug('Received createUserDto:', createUserDto);

    const newUser = new UserEntity();
    newUser.username = createUserDto.username;
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    this.logger.debug('newUser:', newUser);

    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity>{       //Используется для входа!!! Выше для регистрации !
    const user =  await this.userRepository.findOne({
      where: {
        email: loginUserDto.email
      },
      select: ['id', 'username', 'bio', 'img', 'email', 'password']     //нужен пароль для сравнения! поэтому описываем все сущности
    });

    if(!user){
      throw new HttpException('Нет email', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isUserPassword = await compare(loginUserDto.password, user.password);

    if(!isUserPassword){
      throw new HttpException('Пароль неправильный', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    delete user.password; //удаляем пароль, что бы не отправлять его на клиент
    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({where: {id}});
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity>{
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);    //подходит как для обновления так и для создания сущностей !!!
  }

  generateJwt(user: UserEntity): string {
        return sign({
          id: user.id,
          username: user.username,
          email: user.email
        }, JWT_SECRET);
  }
  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user)
      }
    }
  }
}