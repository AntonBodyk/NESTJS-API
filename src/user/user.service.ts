import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserEntity } from "@app/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {sign} from 'jsonwebtoken';
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "@app/types/userResponse.interface";

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